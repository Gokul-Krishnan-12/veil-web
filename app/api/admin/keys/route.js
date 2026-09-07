import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function GET() {
  try {
    const keys = await db.listLicenseKeys();
    return NextResponse.json({ success: true, keys: keys || [] });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
