import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const adminUser = await db.getAdminByEmail(email);

    if (!adminUser || adminUser.password_hash !== password) {
      return NextResponse.json({ success: false, error: "Invalid admin credentials." }, { status: 401 });
    }

    // Return authenticated session token
    const token = Buffer.from(`${adminUser.id}:${Date.now()}`).toString("base64");
    return NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
      token,
      admin: { id: adminUser.id, email: adminUser.email, name: adminUser.name }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
