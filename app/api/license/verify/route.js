import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { key, deviceId } = body;

    if (!key) {
      return NextResponse.json({ valid: false, error: "License key is required." }, { status: 400 });
    }

    const formattedKey = key.trim().toUpperCase();
    const keyRecord = await db.getLicenseByKey(formattedKey);

    if (!keyRecord) {
      return NextResponse.json({ valid: false, error: "License key not found in registry." }, { status: 404 });
    }

    if (keyRecord.status === "revoked") {
      return NextResponse.json({
        valid: false,
        isRevoked: true,
        error: "This license key has been revoked or replaced.",
        replacedByKey: keyRecord.replaced_by_key || null
      }, { status: 403 });
    }

    let isDeviceRegistered = false;
    if (deviceId) {
      const dev = await db.getDeviceActivation(keyRecord.id, deviceId);
      isDeviceRegistered = Boolean(dev);
    }

    return NextResponse.json({
      valid: true,
      key: keyRecord.key,
      tier: keyRecord.tier,
      maxSeats: keyRecord.max_seats,
      seatsUsed: keyRecord.seats_used,
      customerEmail: keyRecord.customer_email,
      isDeviceRegistered
    });
  } catch (err) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
