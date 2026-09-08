import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tier, customerEmail, customerName } = body;
    const email = (customerEmail || '').trim().toLowerCase();
    const name = (customerName || '').trim() || email.split('@')[0];

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required to proceed with checkout.' },
        { status: 400 }
      );
    }

    const validTier = (tier || 'pro').toLowerCase() === 'enterprise' ? 'enterprise' : 'pro';

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId =
      validTier === 'enterprise'
        ? process.env.LEMONSQUEEZY_ENTERPRISE_VARIANT_ID
        : process.env.LEMONSQUEEZY_PRO_VARIANT_ID;

    // Detect origin for redirect URL
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:4000';
    const protocol = req.headers.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
    const origin = `${protocol}://${host}`;

    // 1. Live Lemon Squeezy integration when API key & store ID are provided
    if (apiKey && storeId && variantId) {
      const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                email: email,
                name: name,
                custom: {
                  tier: validTier,
                  customer_email: email,
                  customer_name: name
                }
              },
              product_options: {
                redirect_url: `${origin}/checkout?order_id=[order_id]&status=success`
              }
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: String(storeId)
                }
              },
              variant: {
                data: {
                  type: 'variants',
                  id: String(variantId)
                }
              }
            }
          }
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('[Lemon Squeezy API Error]', responseData);
        const errorDetail =
          responseData?.errors?.[0]?.detail ||
          responseData?.errors?.[0]?.title ||
          'Failed to create Lemon Squeezy checkout session.';
        return NextResponse.json({ success: false, error: errorDetail }, { status: 502 });
      }

      const checkoutUrl = responseData?.data?.attributes?.url;
      return NextResponse.json({
        success: true,
        checkoutUrl,
        mode: 'live'
      });
    }

    // 2. Sandbox / Dev Simulation Mode when API credentials are not yet configured in .env
    const simulatedOrderId = `ls_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const simulatedCheckoutUrl = `${origin}/checkout?order_id=${simulatedOrderId}&status=success&simulated=true&tier=${validTier}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;

    return NextResponse.json({
      success: true,
      checkoutUrl: simulatedCheckoutUrl,
      orderId: simulatedOrderId,
      mode: 'sandbox',
      notice: 'Running in Lemon Squeezy sandbox simulation mode. Add LEMONSQUEEZY_API_KEY to .env for live API sessions.'
    });
  } catch (err) {
    console.error('[Lemon Squeezy Checkout Handler Error]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
