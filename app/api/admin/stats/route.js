import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function GET() {
  try {
    const stats = await db.getStats();
    return NextResponse.json({ success: true, stats });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
