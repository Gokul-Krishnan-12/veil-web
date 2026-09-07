const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');

const SECRET_SALT = "SSP_SECURE_SALT_v1_enterprise_2026";

function computeChecksum(str) {
  let hash = 5381;
  const combined = str + SECRET_SALT;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) + hash) + combined.charCodeAt(i);
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(4, "0");
  return hex.substring(0, 4);
}

function generateKeyString(tier = "pro") {
  const normTier = (tier || "").toLowerCase();
  let prefix = "VEIL-PRO";
  if (normTier === "enterprise") {
    prefix = "VEIL-ENT30";
  } else if (normTier === "trial" || normTier === "free_trial" || normTier === "free") {
    prefix = "VEIL-TRIAL";
  }
  const payload = crypto.randomBytes(2).toString("hex").toUpperCase();
  const checksum = computeChecksum(`${prefix}-${payload}`);
  return `${prefix}-${payload}-${checksum}`;
}

// Auto-encode passwords containing special characters (like '@') in connection strings
function normalizeConnectionString(raw) {
  if (!raw || typeof raw !== 'string') return raw;
  try {
    const match = raw.match(/^(postgresql:\/\/[^:]+:)(.*)@([^@\/]+)(:\d+)?(\/.*)$/);
    if (match) {
      const prefix = match[1];
      const password = match[2];
      const host = match[3];
      const port = match[4] || '';
      const rest = match[5];
      const safePassword = encodeURIComponent(decodeURIComponent(password));
      return `${prefix}${safePassword}@${host}${port}${rest}`;
    }
  } catch (e) {}
  return raw;
}

const rawConnString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const connectionString = normalizeConnectionString(rawConnString);
const hasValidDbUrl = Boolean(connectionString && !connectionString.includes('[YOUR-PASSWORD]'));

let pgPool = null;
let isConnectedToPostgres = false;

if (hasValidDbUrl) {
  try {
    pgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000
    });
    isConnectedToPostgres = true;
  } catch (err) {
    console.warn('[Veil DB] Failed to initialize Postgres pool, falling back to mock:', err.message);
  }
}

// Local mock DB fallback file for local sandbox resilience
const mockFilePath = path.join(process.cwd(), 'lib', 'mock_db.json');
let mockDb = {
  admins: [
    { id: "admin-1", email: "admin@veil.app", password_hash: "admin123", name: "Veil Superadmin" }
  ],
  customers: [
    { id: "cust-1", email: "demo@customer.io", name: "Demo User", company: "Demo Corp" }
  ],
  license_keys: [
    {
      id: "key-1",
      key: "VEIL-PRO-8F21-99A0",
      tier: "pro",
      max_seats: 3,
      seats_used: 1,
      customer_email: "demo@customer.io",
      status: "active",
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      revoked_at: null,
      replaced_by_key: null
    },
    {
      id: "key-2",
      key: "VEIL-ENT30-C419-72E5",
      tier: "enterprise",
      max_seats: 30,
      seats_used: 3,
      customer_email: "enterprise@fintech.io",
      status: "active",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      revoked_at: null,
      replaced_by_key: null
    }
  ],
  device_activations: [
    { id: "dev-1", license_key_id: "key-1", device_id: "demo-device-uuid-1", activated_at: new Date().toISOString() },
    { id: "dev-2", license_key_id: "key-2", device_id: "team-member-1", activated_at: new Date().toISOString() },
    { id: "dev-3", license_key_id: "key-2", device_id: "team-member-2", activated_at: new Date().toISOString() }
  ]
};

if (fs.existsSync(mockFilePath)) {
  try {
    mockDb = JSON.parse(fs.readFileSync(mockFilePath, 'utf8'));
  } catch (e) {}
}

function saveMockDb() {
  try {
    const dir = path.dirname(mockFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(mockFilePath, JSON.stringify(mockDb, null, 2));
  } catch (e) {}
}

/**
 * Execute a query using Postgres Pool if connected, or fallback.
 */
async function query(sql, params = []) {
  if (pgPool && isConnectedToPostgres) {
    try {
      const res = await pgPool.query(sql, params);
      return { rows: res.rows, rowCount: res.rowCount };
    } catch (err) {
      console.warn('[Veil DB] Live query failed:', err.message);
      throw err;
    }
  }
  return null;
}

// -------------------------------------------------------------
// Database Operations
// -------------------------------------------------------------

async function getAdminByEmail(email) {
  const normalized = (email || '').trim().toLowerCase();
  if (pgPool && isConnectedToPostgres) {
    const res = await query('SELECT * FROM admins WHERE LOWER(email) = $1 LIMIT 1', [normalized]);
    return res.rows[0] || null;
  }
  return mockDb.admins.find(a => a.email.toLowerCase() === normalized) || null;
}

async function getLicenseByKey(keyString) {
  const formatted = (keyString || '').trim().toUpperCase();
  if (pgPool && isConnectedToPostgres) {
    const res = await query('SELECT * FROM license_keys WHERE key = $1 LIMIT 1', [formatted]);
    return res.rows[0] || null;
  }
  return mockDb.license_keys.find(k => k.key === formatted) || null;
}

async function getDeviceActivation(licenseKeyId, deviceId) {
  if (pgPool && isConnectedToPostgres) {
    const res = await query(
      'SELECT * FROM device_activations WHERE license_key_id = $1 AND device_id = $2 LIMIT 1',
      [licenseKeyId, deviceId]
    );
    return res.rows[0] || null;
  }
  return mockDb.device_activations.find(d => d.license_key_id === licenseKeyId && d.device_id === deviceId) || null;
}

async function createDeviceActivation(licenseKeyId, deviceId, deviceName) {
  if (pgPool && isConnectedToPostgres) {
    const res = await query(
      `INSERT INTO device_activations (license_key_id, device_id, device_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (license_key_id, device_id) DO UPDATE SET last_verified_at = NOW()
       RETURNING *`,
      [licenseKeyId, deviceId, deviceName || 'Browser Client']
    );
    return res.rows[0];
  }
  let existing = mockDb.device_activations.find(d => d.license_key_id === licenseKeyId && d.device_id === deviceId);
  if (!existing) {
    existing = {
      id: 'dev-' + Math.random().toString(36).slice(2, 9),
      license_key_id: licenseKeyId,
      device_id: deviceId,
      device_name: deviceName || 'Browser Client',
      activated_at: new Date().toISOString()
    };
    mockDb.device_activations.push(existing);
    saveMockDb();
  }
  return existing;
}

async function updateLicenseSeatsUsed(licenseKeyId, seatsUsed) {
  if (pgPool && isConnectedToPostgres) {
    await query('UPDATE license_keys SET seats_used = $1 WHERE id = $2', [seatsUsed, licenseKeyId]);
    return;
  }
  const keyRec = mockDb.license_keys.find(k => k.id === licenseKeyId);
  if (keyRec) {
    keyRec.seats_used = seatsUsed;
    saveMockDb();
  }
}

async function removeDeviceActivation(licenseKeyId, deviceId) {
  if (pgPool && isConnectedToPostgres) {
    const check = await query(
      'SELECT * FROM device_activations WHERE license_key_id = $1 AND device_id = $2 LIMIT 1',
      [licenseKeyId, deviceId]
    );
    if (!check.rows.length) {
      return { success: false, message: 'Device was not active on this license.' };
    }
    await query(
      'DELETE FROM device_activations WHERE license_key_id = $1 AND device_id = $2',
      [licenseKeyId, deviceId]
    );
    const updated = await query(
      'UPDATE license_keys SET seats_used = GREATEST(0, seats_used - 1) WHERE id = $1 RETURNING seats_used, max_seats',
      [licenseKeyId]
    );
    return {
      success: true,
      seatsUsed: updated.rows[0]?.seats_used ?? 0,
      maxSeats: updated.rows[0]?.max_seats ?? 1
    };
  }
  const idx = mockDb.device_activations.findIndex(d => d.license_key_id === licenseKeyId && d.device_id === deviceId);
  if (idx !== -1) {
    mockDb.device_activations.splice(idx, 1);
    const keyRec = mockDb.license_keys.find(k => k.id === licenseKeyId);
    if (keyRec) {
      keyRec.seats_used = Math.max(0, (keyRec.seats_used || 1) - 1);
    }
    saveMockDb();
    return {
      success: true,
      seatsUsed: keyRec ? keyRec.seats_used : 0,
      maxSeats: keyRec ? keyRec.max_seats : 1
    };
  }
  return { success: false, message: 'Device was not active on this license.' };
}

async function createLicenseKey({ key, tier, maxSeats, customerEmail }) {
  if (pgPool && isConnectedToPostgres) {
    const res = await query(
      `INSERT INTO license_keys (key, tier, max_seats, seats_used, customer_email, status)
       VALUES ($1, $2, $3, 0, $4, 'active')
       RETURNING *`,
      [key, tier, maxSeats, customerEmail]
    );
    return res.rows[0];
  }
  const newRec = {
    id: 'key-' + Math.random().toString(36).slice(2, 9),
    key,
    tier,
    max_seats: maxSeats,
    seats_used: 0,
    customer_email: customerEmail,
    status: 'active',
    created_at: new Date().toISOString(),
    revoked_at: null,
    replaced_by_key: null
  };
  mockDb.license_keys.unshift(newRec);
  saveMockDb();
  return newRec;
}

async function createCustomer({ email, name, company }) {
  if (pgPool && isConnectedToPostgres) {
    await query(
      `INSERT INTO customers (email, name, company)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, company = EXCLUDED.company`,
      [email, name || email.split('@')[0], company || 'Individual']
    );
    return;
  }
  const existing = mockDb.customers.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (!existing) {
    mockDb.customers.push({
      id: 'cust-' + Math.random().toString(36).slice(2, 9),
      email,
      name: name || email.split('@')[0],
      company: company || 'Individual',
      created_at: new Date().toISOString()
    });
    saveMockDb();
  }
}

async function revokeAndReissueKey(oldKeyRecord, newKey) {
  if (pgPool && isConnectedToPostgres) {
    await query(
      `UPDATE license_keys 
       SET status = 'revoked', revoked_at = NOW(), replaced_by_key = $1 
       WHERE id = $2`,
      [newKey, oldKeyRecord.id]
    );
    const res = await query(
      `INSERT INTO license_keys (key, tier, max_seats, seats_used, customer_email, status)
       VALUES ($1, $2, $3, 0, $4, 'active')
       RETURNING *`,
      [newKey, oldKeyRecord.tier, oldKeyRecord.max_seats, oldKeyRecord.customer_email]
    );
    return res.rows[0];
  }
  oldKeyRecord.status = 'revoked';
  oldKeyRecord.revoked_at = new Date().toISOString();
  oldKeyRecord.replaced_by_key = newKey;
  const newRec = {
    id: 'key-' + Math.random().toString(36).slice(2, 9),
    key: newKey,
    tier: oldKeyRecord.tier,
    max_seats: oldKeyRecord.max_seats,
    seats_used: 0,
    customer_email: oldKeyRecord.customer_email,
    status: 'active',
    created_at: new Date().toISOString(),
    revoked_at: null,
    replaced_by_key: null
  };
  mockDb.license_keys.unshift(newRec);
  saveMockDb();
  return newRec;
}

async function listLicenseKeys() {
  if (pgPool && isConnectedToPostgres) {
    const res = await query('SELECT * FROM license_keys ORDER BY created_at DESC');
    return res.rows;
  }
  return mockDb.license_keys;
}

async function listCustomers() {
  if (pgPool && isConnectedToPostgres) {
    const res = await query('SELECT * FROM customers ORDER BY created_at DESC');
    return res.rows;
  }
  return mockDb.customers;
}

async function getStats() {
  const keys = await listLicenseKeys();

  // A key is a replacement if it was issued as the replacement of an earlier key
  const replacementKeySet = new Set(keys.map(k => k.replaced_by_key).filter(Boolean));

  // Paid orders are the original customer purchases (not free replacements)
  const paidPurchases = keys.filter(k => !replacementKeySet.has(k.key));
  const proPaidCount = paidPurchases.filter(k => k.tier === 'pro').length;
  const enterprisePaidCount = paidPurchases.filter(k => k.tier === 'enterprise').length;
  const trialCount = paidPurchases.filter(k => k.tier === 'trial' || k.tier === 'free_trial').length;

  const totalRevenue = (proPaidCount * 29) + (enterprisePaidCount * 199);
  const avgOrderValue = (proPaidCount + enterprisePaidCount) ? Math.round(totalRevenue / (proPaidCount + enterprisePaidCount)) : 0;

  return {
    totalKeys: keys.length,
    activeKeys: keys.filter(k => k.status === 'active').length,
    revokedKeys: keys.filter(k => k.status === 'revoked').length,
    reissuedKeysCount: replacementKeySet.size,
    paidOrdersCount: paidPurchases.length,
    proKeys: proPaidCount,
    enterpriseKeys: enterprisePaidCount,
    trialKeys: trialCount,
    totalSeatsAllocated: keys.reduce((acc, k) => acc + (k.status === 'active' ? (k.max_seats || 1) : 0), 0),
    totalSeatsUsed: keys.reduce((acc, k) => acc + (k.status === 'active' ? (k.seats_used || 0) : 0), 0),
    totalRevenue,
    proRevenue: proPaidCount * 29,
    enterpriseRevenue: enterprisePaidCount * 199,
    avgOrderValue
  };
}

async function listPayments() {
  const keys = await listLicenseKeys();

  // Map replacement keys to their original keys
  const replacedByMap = {};
  keys.forEach(k => {
    if (k.replaced_by_key) {
      replacedByMap[k.replaced_by_key] = k;
    }
  });

  return keys.map((k) => {
    const isReplacement = Boolean(replacedByMap[k.key]);
    const oldKeyRecord = replacedByMap[k.key];
    const isTrial = k.tier === 'trial' || k.tier === 'free_trial';
    const amount = isReplacement ? 0 : (isTrial ? 0 : (k.tier === 'enterprise' ? 199 : 29));
    const shortId = (k.id || '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase() || 'PAY';

    let statusText = 'Succeeded';
    let paymentMethod = k.tier === 'enterprise' ? 'Stripe Checkout (Card)' : 'Stripe Checkout (Card)';

    if (isTrial) {
      statusText = 'Free Trial Active';
      paymentMethod = 'Admin Free Trial ($0.00)';
    } else if (isReplacement) {
      statusText = 'Free Reissue (Exchange)';
      paymentMethod = `Free Replacement for ${oldKeyRecord ? oldKeyRecord.key : 'Revoked Key'} ($0.00)`;
    } else if (k.status === 'revoked') {
      statusText = `Succeeded (Reissued to ${k.replaced_by_key || 'new key'})`;
    }

    return {
      txId: `TX-${shortId}`,
      key: k.key,
      customerEmail: k.customer_email,
      tier: k.tier,
      maxSeats: k.max_seats,
      amount: amount,
      isReplacement: isReplacement,
      isTrial: isTrial,
      replacedFrom: oldKeyRecord ? oldKeyRecord.key : null,
      replacedBy: k.replaced_by_key || null,
      currency: 'USD',
      status: statusText,
      paymentMethod: paymentMethod,
      createdAt: k.created_at
    };
  });
}

module.exports = {
  isConnectedToPostgres,
  hasValidDbUrl,
  generateKeyString,
  getAdminByEmail,
  getLicenseByKey,
  getDeviceActivation,
  createDeviceActivation,
  removeDeviceActivation,
  updateLicenseSeatsUsed,
  createLicenseKey,
  createCustomer,
  revokeAndReissueKey,
  listLicenseKeys,
  listCustomers,
  getStats,
  listPayments
};
