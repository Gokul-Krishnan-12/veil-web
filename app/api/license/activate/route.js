import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { key, email, deviceId, deviceName } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: "License key is required." }, { status: 400 });
    }
    if (!deviceId) {
      return NextResponse.json({ success: false, error: "Browser identifier is required." }, { status: 400 });
    }

    const formattedKey = key.trim().toUpperCase();
    const keyRecord = await db.getLicenseByKey(formattedKey);

    if (!keyRecord) {
      return NextResponse.json({
        success: false,
        message: "License key not found in registry. Check for typos or contact support."
      }, { status: 404 });
    }

    if (keyRecord.status === "revoked") {
      return NextResponse.json({
        success: false,
        message: "This license key has been revoked and can no longer be activated."
      }, { status: 403 });
    }

    // Check if browser is already registered on this key
    const existingDev = await db.getDeviceActivation(keyRecord.id, deviceId);
    if (existingDev) {
      return NextResponse.json({
        success: true,
        message: "Browser already registered and verified on this license.",
        key: keyRecord.key,
        tier: keyRecord.tier,
        maxSeats: keyRecord.max_seats,
        seatsUsed: keyRecord.seats_used,
        customerEmail: keyRecord.customer_email
      });
    }

    // Verify browser seat capacity
    if (keyRecord.seats_used >= keyRecord.max_seats) {
      const quotaMsg = keyRecord.max_seats === 1
        ? "Single-User Limit: This license is already in use on another browser. Deactivate on the other browser or upgrade to Enterprise."
        : `Enterprise Quota Reached: All ${keyRecord.max_seats}/${keyRecord.max_seats} browser seats are currently assigned.`;
      return NextResponse.json({ success: false, message: quotaMsg }, { status: 409 });
    }

    // Register new browser activation
    await db.createDeviceActivation(keyRecord.id, deviceId, deviceName || "Browser Extension Client");

    const newSeatsUsed = (keyRecord.seats_used || 0) + 1;
    await db.updateLicenseSeatsUsed(keyRecord.id, newSeatsUsed);

    return NextResponse.json({
      success: true,
      message: `License successfully activated on this browser! (${newSeatsUsed}/${keyRecord.max_seats} seats in use)`,
      key: keyRecord.key,
      tier: keyRecord.tier,
      maxSeats: keyRecord.max_seats,
      seatsUsed: newSeatsUsed,
      customerEmail: keyRecord.customer_email
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
