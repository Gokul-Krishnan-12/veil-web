import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tier, customerEmail, customerName } = body;
    const reqTier = (tier || "pro").toLowerCase();

    let validTier = "pro";
    let maxSeats = 3;
    let label = "Personal Lifetime (3 Browsers)";

    if (reqTier === "enterprise") {
      validTier = "enterprise";
      maxSeats = 30;
      label = "Enterprise (30 Seats)";
    } else if (reqTier === "trial" || reqTier === "free_trial" || reqTier === "free") {
      validTier = "trial";
      maxSeats = 1;
      label = "Free Trial (1 Seat — $0.00)";
    }

    const email = (customerEmail || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ success: false, error: "Customer email is required." }, { status: 400 });
    }

    const newKey = db.generateKeyString(validTier);
    await db.createLicenseKey({
      key: newKey,
      tier: validTier,
      maxSeats,
      customerEmail: email
    });

    await db.createCustomer({
      email,
      name: customerName || email.split('@')[0],
      company: validTier === 'enterprise' ? 'Enterprise Client' : (validTier === 'trial' ? 'Free Trial User' : 'Individual')
    });

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${label} license key!`,
      key: newKey,
      tier: validTier,
      maxSeats,
      customerEmail: email,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
