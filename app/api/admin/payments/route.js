import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function GET() {
  try {
    const payments = await db.listPayments();
    return NextResponse.json({ success: true, payments });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
