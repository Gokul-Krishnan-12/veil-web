-- Veil Cloud Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the licensing tables

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. License Keys Table
CREATE TABLE IF NOT EXISTS license_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('pro', 'enterprise')),
  max_seats INT NOT NULL DEFAULT 3,
  seats_used INT NOT NULL DEFAULT 0,
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  replaced_by_key TEXT
);

-- 4. Device Activations Table
CREATE TABLE IF NOT EXISTS device_activations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key_id UUID REFERENCES license_keys(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_name TEXT,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (license_key_id, device_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_activations ENABLE ROW LEVEL SECURITY;

-- Allow service_role key to bypass RLS for API routes
CREATE POLICY "Allow service role full access on admins" ON admins USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role full access on customers" ON customers USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role full access on license_keys" ON license_keys USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role full access on device_activations" ON device_activations USING (true) WITH CHECK (true);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_license_keys_key ON license_keys(key);
CREATE INDEX IF NOT EXISTS idx_license_keys_email ON license_keys(customer_email);
CREATE INDEX IF NOT EXISTS idx_device_activations_key_id ON device_activations(license_key_id);

-- Initial Seed Data: Default Master Admin (Password: admin123)
INSERT INTO admins (email, password_hash, name)
VALUES ('admin@veil.app', 'admin123', 'Veil Superadmin')
ON CONFLICT (email) DO NOTHING;
