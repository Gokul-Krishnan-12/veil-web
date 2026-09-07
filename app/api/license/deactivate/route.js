import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { key, deviceId } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: 'License key is required.' }, { status: 400 });
    }
    if (!deviceId) {
      return NextResponse.json({ success: false, error: 'Browser identifier is required.' }, { status: 400 });
    }

    const formattedKey = key.trim().toUpperCase();
    const keyRecord = await db.getLicenseByKey(formattedKey);

    if (!keyRecord) {
      return NextResponse.json({
        success: false,
        message: 'License key not found in registry.'
      }, { status: 404 });
    }

    const result = await db.removeDeviceActivation(keyRecord.id, deviceId);

    if (!result.success) {
      return NextResponse.json({
        success: true,
        message: 'Browser was not bound to this license in database.',
        seatsUsed: keyRecord.seats_used,
        maxSeats: keyRecord.max_seats
      });
    }

    return NextResponse.json({
      success: true,
      message: `License seat successfully released on this browser (${result.seatsUsed}/${result.maxSeats} browser seats now in use).`,
      key: keyRecord.key,
      seatsUsed: result.seatsUsed,
      maxSeats: result.maxSeats
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
