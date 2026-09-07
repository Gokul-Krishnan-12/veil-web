import { NextResponse } from 'next/server';
const db = require('@/lib/db');

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "Veil Cloud License & Web Next.js API",
    database: db.isConnectedToPostgres
      ? "Live Supabase PostgreSQL (Connected)"
      : (db.hasValidDbUrl ? "Postgres Pool configured (waiting for credentials)" : "Local Mock Database (Configure .env for live Supabase)"),
    timestamp: new Date().toISOString()
  });
}
