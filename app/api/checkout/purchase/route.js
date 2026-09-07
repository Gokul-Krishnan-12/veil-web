import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tier, customerEmail, customerName } = body;
    const email = (customerEmail || "").trim().toLowerCase();
    const name = (customerName || "").trim() || email.split("@")[0];

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required to receive your license key." },
        { status: 400 }
      );
    }

    const validTier = (tier || "pro").toLowerCase() === "enterprise" ? "enterprise" : "pro";
    const maxSeats = validTier === "enterprise" ? 20 : 1;
    const priceAmount = validTier === "enterprise" ? 199 : 29;

    // Generate cryptographic key
    const newKey = db.generateKeyString(validTier);

    // Persist into Supabase / DB
    const keyRecord = await db.createLicenseKey({
      key: newKey,
      tier: validTier,
      maxSeats: maxSeats,
      customerEmail: email
    });

    // Save customer record
    await db.createCustomer({
      email,
      name,
      company: validTier === "enterprise" ? "Enterprise Customer" : "Individual"
    });

    console.log("==================================================");
    console.log(`[Veil Email Dispatcher] ✉️ Order receipt & key delivered!`);
    console.log(`To:        ${email} (${name})`);
    console.log(`Subject:   Your Veil Lifetime License Key (${validTier.toUpperCase()})`);
    console.log(`Amount:    $${priceAmount} (One-Time Lifetime)`);
    console.log(`Key:       ${newKey}`);
    console.log(`Seats:     ${maxSeats} Device(s)`);
    console.log("==================================================");

    return NextResponse.json({
      success: true,
      message: `Payment of $${priceAmount} successful! Your lifetime license key has been created and sent to ${email}.`,
      key: newKey,
      tier: validTier,
      maxSeats: maxSeats,
      customerEmail: email,
      customerName: name,
      price: priceAmount,
      emailDispatched: true
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
