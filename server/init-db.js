import { pool } from './db.js';
import { PROPERTIES_DATA } from '../src/data/properties.js';
import bcrypt from 'bcryptjs';

export async function initializeDatabase() {
  console.log('Initializing Neon PostgreSQL database schema...');

  const createTablesQuery = `
    -- 1. Properties Table
    CREATE TABLE IF NOT EXISTS properties (
      id VARCHAR(100) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      locality VARCHAR(100) NOT NULL,
      address TEXT,
      price NUMERIC NOT NULL,
      deposit NUMERIC NOT NULL,
      bhk VARCHAR(50),
      bhk_type VARCHAR(50),
      type VARCHAR(50),
      furnishing VARCHAR(50),
      sqft INTEGER,
      bathrooms INTEGER DEFAULT 2,
      floor VARCHAR(100),
      facing VARCHAR(100),
      available_from VARCHAR(100),
      preferred_tenants VARCHAR(100),
      zero_brokerage BOOLEAN DEFAULT TRUE,
      is_verified BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT FALSE,
      description TEXT,
      owner_name VARCHAR(150),
      owner_phone VARCHAR(50),
      owner_type VARCHAR(50) DEFAULT 'Direct Owner',
      amenities JSONB DEFAULT '[]'::jsonb,
      images JSONB DEFAULT '[]'::jsonb,
      proximity JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Property Images Table (Dedicated in-database image storage)
    CREATE TABLE IF NOT EXISTS property_images (
      id VARCHAR(100) PRIMARY KEY,
      property_id VARCHAR(100),
      image_data TEXT NOT NULL,
      mime_type VARCHAR(100) DEFAULT 'image/jpeg',
      file_name VARCHAR(255),
      file_size INTEGER,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Users Table
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255),
      provider VARCHAR(50) DEFAULT 'Email & Password',
      avatar TEXT,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. Leads & Inquiries Table
    CREATE TABLE IF NOT EXISTS leads (
      id VARCHAR(100) PRIMARY KEY,
      tenant_name VARCHAR(150) NOT NULL,
      tenant_phone VARCHAR(50) NOT NULL,
      property_id VARCHAR(100),
      property_title VARCHAR(255),
      locality VARCHAR(100),
      status VARCHAR(50) DEFAULT 'New',
      notes TEXT,
      date VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. Contact & Business Settings Table
    CREATE TABLE IF NOT EXISTS contact_settings (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
      name VARCHAR(255),
      proprietor VARCHAR(150),
      role VARCHAR(100),
      phone VARCHAR(50),
      phone_raw VARCHAR(50),
      whatsapp VARCHAR(50),
      email VARCHAR(255),
      address TEXT,
      locality VARCHAR(100),
      slogan VARCHAR(255),
      services JSONB DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(createTablesQuery);
  console.log('Database tables created/verified successfully in Neon DB.');

  // Clean up any previously seeded mock properties
  await pool.query("DELETE FROM properties WHERE id LIKE 'prop-1%';");
  console.log('Cleared hardcoded mock properties from Neon DB.');

  // Check contact_settings seeding
  const contactRes = await pool.query('SELECT COUNT(*) FROM contact_settings');
  if (parseInt(contactRes.rows[0].count, 10) === 0) {
    console.log('Seeding default contact settings into Neon DB...');
    const insertContact = `
      INSERT INTO contact_settings (
        id, name, proprietor, role, phone, phone_raw, whatsapp, email, address, locality, slogan, services
      ) VALUES (
        'main',
        'The Bangalore Properties',
        'V. RAMANA',
        'Proprietor',
        '+91 80504 07710',
        '+918050407710',
        '+918050407710',
        'ramuramana92@gmail.com',
        'Ground floor, Srinivas Residency, 2nd Main, KR Garden, Murugeshpalaya, Bangalore - 560017',
        'Murugeshpalaya',
        'YOUR PROPERTY, OUR PRIORITY.',
        $1
      );
    `;
    const services = [
      "RESIDENTIAL RENT",
      "COMMERCIAL RENT",
      "OFFICE SPACE RENT",
      "GODOWN SPACE RENT",
      "LONG TERM LEASE RENT"
    ];
    await pool.query(insertContact, [JSON.stringify(services)]);
  }

  // Clean up any sample leads tied to hardcoded mock properties
  await pool.query("DELETE FROM leads WHERE id LIKE 'lead-1%';");

  // Create / sync default admin user from .env credentials
  const adminEmail = (process.env.ADMIN_EMAIL || 'vramanarentals@gmail.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ramana rentals';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  const adminRes = await pool.query("SELECT * FROM users WHERE email = $1", [adminEmail]);
  if (adminRes.rows.length === 0) {
    await pool.query(`
      INSERT INTO users (id, name, email, password, provider, avatar, is_admin)
      VALUES (
        'usr-admin',
        'V. RAMANA (Proprietor)',
        $1,
        $2,
        'Admin Account',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=VRamana',
        TRUE
      ) ON CONFLICT (email) DO UPDATE SET password = $2, is_admin = TRUE;
    `, [adminEmail, hashedAdminPassword]);
  } else {
    await pool.query("UPDATE users SET password = $1, is_admin = TRUE WHERE email = $2;", [hashedAdminPassword, adminEmail]);
  }

  console.log('Neon Database initialization complete!');
}

// If run directly:
if (process.argv[1]?.endsWith('init-db.js')) {
  initializeDatabase()
    .then(() => {
      console.log('Database init script finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}
