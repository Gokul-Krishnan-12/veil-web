import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { oldKey } = body;
    const customerEmail = body.customerEmail || body.email;

    if (!oldKey || !customerEmail) {
      return NextResponse.json(
        { success: false, error: "Old key and customer email are required." },
        { status: 400 }
      );
    }

    const formattedOldKey = oldKey.trim().toUpperCase();
    const formattedEmail = customerEmail.trim().toLowerCase();

    const oldRecord = await db.getLicenseByKey(formattedOldKey);
    if (!oldRecord) {
      return NextResponse.json({ success: false, message: "Specified license key was not found." }, { status: 404 });
    }

    if (oldRecord.customer_email.toLowerCase() !== formattedEmail) {
      return NextResponse.json(
        { success: false, message: "Email does not match the registered owner of this license." },
        { status: 403 }
      );
    }

    if (oldRecord.status === "revoked") {
      return NextResponse.json({ success: false, message: "This license key is already revoked." }, { status: 400 });
    }

    const newKey = db.generateKeyString(oldRecord.tier);
    const newRecord = await db.revokeAndReissueKey(oldRecord, newKey);

    return NextResponse.json({
      success: true,
      message: "License successfully revoked! A new replacement key has been generated.",
      oldKey: formattedOldKey,
      newKey: newKey,
      tier: oldRecord.tier,
      maxSeats: oldRecord.max_seats,
      customerEmail: oldRecord.customer_email
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
