const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  console.log('====================================================');
  console.log('⚡ Veil Cloud Supabase PostgreSQL Migration & Setup');
  console.log('====================================================');

  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ Error: Neither DIRECT_URL nor DATABASE_URL is defined in .env.');
    console.error('Please configure your database connection string in .env and try again.');
    process.exit(1);
  }

  if (connectionString.includes('[YOUR-PASSWORD]')) {
    console.error('❌ Error: The connection string still contains the placeholder "[YOUR-PASSWORD]".');
    console.error('👉 Please open .env and replace [YOUR-PASSWORD] with your actual Supabase database password.');
    console.error('   Example: DIRECT_URL="postgresql://postgres.ciwjhdxassuizsxwipoc:MySecretPass123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"');
    process.exit(1);
  }

  console.log('📡 Connecting to Supabase PostgreSQL at:');
  const sanitizedUrl = connectionString.replace(/:([^:@]+)@/, ':••••••••@');
  console.log(`   ${sanitizedUrl}`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to Supabase PostgreSQL!');

    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('🔨 Executing schema migration (creating admins, customers, license_keys, device_activations)...');

    await client.query(schemaSql);
    console.log('✅ Tables and initial records created successfully!');

    // Verify tables exist
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('admins', 'customers', 'license_keys', 'device_activations');
    `);

    const tablesFound = res.rows.map(r => r.table_name);
    console.log('📋 Verified existing tables in public schema:', tablesFound.join(', '));

    // Check admin record
    const adminRes = await client.query('SELECT email, name FROM admins LIMIT 1;');
    if (adminRes.rows.length > 0) {
      console.log('👤 Admin account verified:');
      console.log(`   Email:    ${adminRes.rows[0].email}`);
      console.log(`   Password: admin123 (Default)`);
      console.log(`   URL:      http://localhost:3000/v-sec-7x92kp/admin`);
    }

    console.log('====================================================');
    console.log('🎉 Supabase Database Setup Completed Successfully!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Database migration failed:');
    console.error(`   ${err.message}`);
    if (err.message.includes('password authentication failed')) {
      console.error('👉 Make sure the password in .env matches your Supabase database password.');
    }
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
