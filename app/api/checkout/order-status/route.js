import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');
    const isSimulated = searchParams.get('simulated') === 'true' || (orderId && orderId.startsWith('ls_sim_'));
    const paramTier = (searchParams.get('tier') || 'pro').toLowerCase() === 'enterprise' ? 'enterprise' : 'pro';
    const paramEmail = (searchParams.get('email') || '').trim().toLowerCase();
    const paramName = (searchParams.get('name') || '').trim();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Missing order_id query parameter' }, { status: 400 });
    }

    // 1. Check if order was already processed and stored in DB
    const existingOrder = await db.getPaymentOrderByOrderId(orderId);
    if (existingOrder && existingOrder.license_key) {
      const maxSeats = existingOrder.tier === 'enterprise' ? 30 : 3;
      return NextResponse.json({
        success: true,
        orderId,
        key: existingOrder.license_key,
        tier: existingOrder.tier,
        maxSeats,
        customerEmail: existingOrder.customer_email,
        customerName: existingOrder.customer_name,
        amount: existingOrder.amount,
        status: existingOrder.status,
        source: 'database'
      });
    }

    // 2. If sandbox / simulation order (or webhook hasn't hit localhost), mint directly
    if (isSimulated || !process.env.LEMONSQUEEZY_API_KEY) {
      const email = paramEmail || 'customer@example.com';
      const name = paramName || email.split('@')[0];
      const tier = paramTier;
      const maxSeats = tier === 'enterprise' ? 30 : 3;
      const amount = tier === 'enterprise' ? 199 : 29;

      const newKey = db.generateKeyString(tier);

      const keyRecord = await db.createLicenseKey({
        key: newKey,
        tier,
        maxSeats,
        customerEmail: email
      });

      await db.createCustomer({
        email,
        name,
        company: tier === 'enterprise' ? 'Enterprise Customer' : 'Individual'
      });

      await db.savePaymentOrder({
        orderId,
        customerEmail: email,
        customerName: name,
        tier,
        amount,
        currency: 'USD',
        status: 'paid',
        licenseKey: newKey,
        licenseKeyId: keyRecord?.id,
        provider: 'lemonsqueezy'
      });

      console.log(`[Veil Order Status API] ⚡ Minted lifetime key for simulated/direct order ${orderId}: ${newKey}`);

      return NextResponse.json({
        success: true,
        orderId,
        key: newKey,
        tier,
        maxSeats,
        customerEmail: email,
        customerName: name,
        amount,
        status: 'paid',
        source: 'sandbox_instant'
      });
    }

    // 3. If live API key is set, query Lemon Squeezy API directly to verify payment
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const lsRes = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/vnd.api+json'
      }
    });

    if (!lsRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Could not verify order with Lemon Squeezy' },
        { status: 404 }
      );
    }

    const lsData = await lsRes.json();
    const orderAttr = lsData?.data?.attributes || {};
    const orderStatus = (orderAttr.status || '').toLowerCase();

    if (orderStatus !== 'paid') {
      return NextResponse.json({
        success: false,
        pending: true,
        orderId,
        status: orderStatus,
        message: 'Payment has not yet settled. Please wait a moment.'
      });
    }

    const email = (orderAttr.user_email || paramEmail || '').trim().toLowerCase();
    const name = (orderAttr.user_name || paramName || email.split('@')[0]).trim();
    const productName = (orderAttr.first_order_item?.product_name || '').toLowerCase();
    const tier = productName.includes('enterprise') || paramTier === 'enterprise' ? 'enterprise' : 'pro';
    const maxSeats = tier === 'enterprise' ? 30 : 3;
    const amount = (orderAttr.total || (tier === 'enterprise' ? 19900 : 2900)) / 100;

    const newKey = db.generateKeyString(tier);

    const keyRecord = await db.createLicenseKey({
      key: newKey,
      tier,
      maxSeats,
      customerEmail: email
    });

    await db.createCustomer({
      email,
      name,
      company: tier === 'enterprise' ? 'Enterprise Customer' : 'Individual'
    });

    await db.savePaymentOrder({
      orderId,
      customerEmail: email,
      customerName: name,
      tier,
      amount,
      currency: orderAttr.currency || 'USD',
      status: 'paid',
      licenseKey: newKey,
      licenseKeyId: keyRecord?.id,
      provider: 'lemonsqueezy'
    });

    return NextResponse.json({
      success: true,
      orderId,
      key: newKey,
      tier,
      maxSeats,
      customerEmail: email,
      customerName: name,
      amount,
      status: 'paid',
      source: 'lemonsqueezy_verified'
    });
  } catch (err) {
    console.error('[Order Status API Error]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
