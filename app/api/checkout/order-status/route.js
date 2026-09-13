import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');
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

    // 2. Direct order processing / minting
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
      provider: 'direct'
    });

    console.log(`[Veil Order Status API] ⚡ Minted lifetime key for direct order ${orderId}: ${newKey}`);

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
      source: 'direct_order'
    });
  } catch (err) {
    console.error('[Order Status API Error]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
