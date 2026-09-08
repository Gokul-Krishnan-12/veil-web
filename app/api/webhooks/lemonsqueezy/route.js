import { NextResponse } from 'next/server';
import crypto from 'crypto';
const db = require('@/lib/db');

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature');
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    // 1. Verify HMAC-SHA256 signature if secret is configured
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: 'Missing x-signature header' }, { status: 401 });
      }
      const hmac = crypto.createHmac('sha256', webhookSecret);
      const digest = hmac.update(rawBody).digest('hex');
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
      }
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventName = payload?.meta?.event_name || payload?.event_name;
    const customData = payload?.meta?.custom_data || {};
    const orderData = payload?.data?.attributes || {};
    const orderId = String(payload?.data?.id || payload?.order_id || '');

    console.log(`[Lemon Squeezy Webhook] 🔔 Received event: ${eventName} for Order ID: ${orderId}`);

    // We specifically process one-time payment orders
    if (eventName === 'order_created') {
      const orderStatus = (orderData.status || 'paid').toLowerCase();

      // Only mint lifetime license key when payment is settled
      if (orderStatus !== 'paid') {
        console.log(`[Lemon Squeezy Webhook] Order ${orderId} status is '${orderStatus}'. Awaiting settlement.`);
        return NextResponse.json({ received: true, status: orderStatus });
      }

      // Check idempotency: avoid double-minting if webhook is retried by Lemon Squeezy
      const existingOrder = await db.getPaymentOrderByOrderId(orderId);
      if (existingOrder && existingOrder.license_key) {
        console.log(`[Lemon Squeezy Webhook] Order ${orderId} already processed. Key: ${existingOrder.license_key}`);
        return NextResponse.json({
          received: true,
          alreadyProcessed: true,
          key: existingOrder.license_key
        });
      }

      const rawEmail = customData.customer_email || orderData.user_email;
      const email = (rawEmail || '').trim().toLowerCase();
      const name = (customData.customer_name || orderData.user_name || '').trim() || email.split('@')[0];

      // Determine tier (Pro or Enterprise)
      let tier = (customData.tier || '').toLowerCase();
      if (tier !== 'enterprise' && tier !== 'pro') {
        const productName = (orderData.first_order_item?.product_name || '').toLowerCase();
        tier = productName.includes('enterprise') ? 'enterprise' : 'pro';
      }

      const maxSeats = tier === 'enterprise' ? 30 : 3;
      const amount = (orderData.total || (tier === 'enterprise' ? 19900 : 2900)) / 100;
      const currency = orderData.currency || 'USD';

      // 2. Generate Cryptographic Lifetime License Key
      const newKey = db.generateKeyString(tier);

      // 3. Persist into Supabase / DB
      const keyRecord = await db.createLicenseKey({
        key: newKey,
        tier: tier,
        maxSeats: maxSeats,
        customerEmail: email
      });

      // 4. Save Customer record
      await db.createCustomer({
        email,
        name,
        company: tier === 'enterprise' ? 'Enterprise Customer' : 'Individual'
      });

      // 5. Save Payment Order (guarantees idempotency)
      await db.savePaymentOrder({
        orderId,
        customerEmail: email,
        customerName: name,
        tier,
        amount,
        currency,
        status: 'paid',
        licenseKey: newKey,
        licenseKeyId: keyRecord?.id,
        provider: 'lemonsqueezy'
      });

      console.log('==================================================');
      console.log(`[Veil Licensing Engine] 🚀 Minted One-Time Lifetime License Key!`);
      console.log(`Provider:    Lemon Squeezy (MoR)`);
      console.log(`Order ID:    ${orderId}`);
      console.log(`Customer:    ${email} (${name})`);
      console.log(`Tier:        ${tier.toUpperCase()} (Lifetime)`);
      console.log(`Key:         ${newKey}`);
      console.log(`Seats:       ${maxSeats} Device(s)`);
      console.log(`Total:       $${amount} ${currency}`);
      console.log('==================================================');

      return NextResponse.json({
        received: true,
        success: true,
        key: newKey,
        tier,
        maxSeats,
        customerEmail: email,
        orderId
      });
    }

    // Default response for other webhook event types
    return NextResponse.json({ received: true, unhandledEvent: eventName });
  } catch (err) {
    console.error('[Lemon Squeezy Webhook Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
