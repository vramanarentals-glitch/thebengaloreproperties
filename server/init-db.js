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

  // Check if properties need seeding
  const propCountRes = await pool.query('SELECT COUNT(*) FROM properties');
  const count = parseInt(propCountRes.rows[0].count, 10);

  if (count === 0) {
    console.log('Seeding initial curated Bengaluru properties into Neon DB...');
    for (const prop of PROPERTIES_DATA) {
      const insertQuery = `
        INSERT INTO properties (
          id, title, locality, address, price, deposit, bhk, bhk_type, type,
          furnishing, sqft, bathrooms, floor, facing, available_from,
          preferred_tenants, zero_brokerage, is_verified, is_featured,
          description, owner_name, owner_phone, owner_type, amenities, images, proximity
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25, $26
        ) ON CONFLICT (id) DO NOTHING;
      `;
      await pool.query(insertQuery, [
        prop.id,
        prop.title,
        prop.locality,
        prop.address,
        prop.price,
        prop.deposit,
        prop.bhk,
        prop.bhkType,
        prop.type,
        prop.furnishing,
        prop.sqft,
        prop.bathrooms || 2,
        prop.floor || '1st Floor',
        prop.facing || 'East Facing',
        prop.availableFrom || 'Immediate',
        prop.preferredTenants || 'Any',
        prop.zeroBrokerage ?? true,
        prop.isVerified ?? true,
        prop.isFeatured ?? false,
        prop.description,
        prop.ownerName || 'V. RAMANA',
        prop.ownerPhone || '+91 80504 07710',
        prop.ownerType || 'Direct Owner',
        JSON.stringify(prop.amenities || []),
        JSON.stringify(prop.images || []),
        JSON.stringify(prop.proximity || {})
      ]);
    }
    console.log(`Seeded ${PROPERTIES_DATA.length} properties.`);
  }

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

  // Check leads seeding
  const leadsRes = await pool.query('SELECT COUNT(*) FROM leads');
  if (parseInt(leadsRes.rows[0].count, 10) === 0) {
    console.log('Seeding initial sample leads into Neon DB...');
    const defaultLeads = [
      {
        id: "lead-101",
        tenant_name: "Rajesh Kumar",
        tenant_phone: "+91 98860 12345",
        property_id: "prop-101",
        property_title: "Skyline Zenith Luxury 3BHK Penthouse",
        locality: "Indiranagar",
        date: "2026-09-03",
        status: "New",
        notes: "Looking to move in by next month. Prefers fully furnished."
      },
      {
        id: "lead-102",
        tenant_name: "Priya Sharma",
        tenant_phone: "+91 97420 54321",
        property_id: "prop-102",
        property_title: "Greenwood Retreat 2BHK Garden Apartment",
        locality: "Koramangala",
        date: "2026-09-02",
        status: "Contacted",
        notes: "Scheduled weekend site visit."
      },
      {
        id: "lead-103",
        tenant_name: "Anand Verma",
        tenant_phone: "+91 99001 88776",
        property_id: "prop-108",
        property_title: "Murugeshpalaya Commercial Godown Space",
        locality: "Murugeshpalaya",
        date: "2026-09-01",
        status: "Scheduled",
        notes: "Requires 3-phase power for warehouse logistics."
      }
    ];

    for (const l of defaultLeads) {
      await pool.query(
        `INSERT INTO leads (id, tenant_name, tenant_phone, property_id, property_title, locality, date, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING;`,
        [l.id, l.tenant_name, l.tenant_phone, l.property_id, l.property_title, l.locality, l.date, l.status, l.notes]
      );
    }
  }

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
