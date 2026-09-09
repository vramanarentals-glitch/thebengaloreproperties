import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { pool, query } from './db.js';
import { initializeDatabase } from './init-db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'vramanarentals@gmail.com').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ramana rentals';
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'tbp_neon_super_admin_secret_key_2026_x89a';

function generateAdminToken(email) {
  return jwt.sign(
    { email, role: 'admin' },
    ADMIN_SECRET_KEY,
    { expiresIn: '24h' }
  );
}

function verifyAdminToken(token) {
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, ADMIN_SECRET_KEY);
    if (decoded && decoded.email === ADMIN_EMAIL && decoded.role === 'admin') {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

// Admin authorization middleware for sensitive endpoints
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'];
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token || !verifyAdminToken(token)) {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  next();
}

// Rate limiter for authentication endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login/registration attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware - supports JSON payloads up to 10MB
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/auth/', authRateLimiter);

// Helper to format property row to frontend model
function formatPropertyRow(row) {
  return {
    id: row.id,
    title: row.title,
    locality: row.locality,
    address: row.address,
    price: Number(row.price),
    deposit: Number(row.deposit),
    bhk: row.bhk,
    bhkType: row.bhk_type,
    type: row.type,
    furnishing: row.furnishing,
    sqft: Number(row.sqft),
    bathrooms: Number(row.bathrooms || 2),
    floor: row.floor,
    facing: row.facing,
    availableFrom: row.available_from,
    preferredTenants: row.preferred_tenants,
    zeroBrokerage: Boolean(row.zero_brokerage),
    isVerified: Boolean(row.is_verified),
    isFeatured: Boolean(row.is_featured),
    description: row.description,
    ownerName: row.owner_name,
    ownerPhone: row.owner_phone,
    ownerType: row.owner_type,
    amenities: typeof row.amenities === 'string' ? JSON.parse(row.amenities) : (row.amenities || []),
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
    proximity: typeof row.proximity === 'string' ? JSON.parse(row.proximity) : (row.proximity || {}),
    createdAt: row.created_at
  };
}

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  try {
    const dbTest = await query('SELECT NOW() as time, current_database() as db_name;');
    const propCount = await query('SELECT COUNT(*) FROM properties;');
    const imageCount = await query('SELECT COUNT(*) FROM property_images;');
    const userCount = await query('SELECT COUNT(*) FROM users;');
    const leadCount = await query('SELECT COUNT(*) FROM leads;');

    res.json({
      status: 'ok',
      database: 'Neon PostgreSQL Connected',
      currentDb: dbTest.rows[0].db_name,
      serverTime: dbTest.rows[0].time,
      counts: {
        properties: parseInt(propCount.rows[0].count, 10),
        images: parseInt(imageCount.rows[0].count, 10),
        users: parseInt(userCount.rows[0].count, 10),
        leads: parseInt(leadCount.rows[0].count, 10)
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// -------------------------------------------------------------
// IMAGE UPLOAD & SERVING (DIRECT TO/FROM NEON DATABASE)
// -------------------------------------------------------------

// Upload an image directly into the PostgreSQL Database (Admin Only)
app.post('/api/upload-image', requireAdmin, async (req, res) => {
  try {
    const { imageData, propertyId, fileName, mimeType } = req.body;
    if (!imageData) {
      return res.status(400).json({ error: 'imageData is required' });
    }

    const imageId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const effectiveMime = mimeType || (imageData.startsWith('data:image/png') ? 'image/png' : 'image/jpeg');
    const fileSize = Buffer.byteLength(imageData, 'utf8');

    const insertQuery = `
      INSERT INTO property_images (id, property_id, image_data, mime_type, file_name, file_size)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, property_id, mime_type, file_name, file_size, created_at;
    `;

    const result = await query(insertQuery, [
      imageId,
      propertyId || null,
      imageData,
      effectiveMime,
      fileName || 'uploaded-property-photo.jpg',
      fileSize
    ]);

    // Return the image ID and direct retrieval URL (which streams from DB)
    res.status(201).json({
      success: true,
      id: imageId,
      url: `/api/images/${imageId}`,
      dataUrl: imageData, // Direct base64 if needed for immediate display
      metadata: result.rows[0]
    });
  } catch (err) {
    console.error('Failed to upload image to Neon DB:', err);
    res.status(500).json({ error: 'Failed to store image in database: ' + err.message });
  }
});

// Retrieve an image directly from the PostgreSQL Database
app.get('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM property_images WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).send('Image not found in database');
    }

    const imgRow = result.rows[0];
    const dataUrl = imgRow.image_data;

    // If it's a data URL (e.g. data:image/jpeg;base64,....)
    if (dataUrl.startsWith('data:')) {
      const parts = dataUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : (imgRow.mime_type || 'image/jpeg');
      const base64Data = parts[1];
      const imgBuffer = Buffer.from(base64Data, 'base64');
      
      res.setHeader('Content-Type', mime);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(imgBuffer);
    }

    // Otherwise redirect or send raw data
    res.setHeader('Content-Type', imgRow.mime_type || 'image/jpeg');
    res.send(dataUrl);
  } catch (err) {
    console.error('Error fetching image from DB:', err);
    res.status(500).send('Error retrieving image from database');
  }
});

// -------------------------------------------------------------
// PROPERTIES API
// -------------------------------------------------------------

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const result = await query('SELECT * FROM properties ORDER BY created_at DESC, id DESC');
    const properties = result.rows.map(formatPropertyRow);
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties from DB:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new property (Admin Only)
app.post('/api/properties', requireAdmin, async (req, res) => {
  try {
    const prop = req.body;
    const id = prop.id || `prop-custom-${Date.now()}`;

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
      ) RETURNING *;
    `;

    const result = await query(insertQuery, [
      id,
      prop.title,
      prop.locality,
      prop.address || `${prop.locality}, Bengaluru`,
      prop.price || 0,
      prop.deposit || 0,
      prop.bhk || '2 BHK',
      prop.bhkType || '2bhk',
      prop.type || 'Apartment',
      prop.furnishing || 'Semi-Furnished',
      prop.sqft || 1000,
      prop.bathrooms || 2,
      prop.floor || '2nd Floor',
      prop.facing || 'East Facing',
      prop.availableFrom || 'Immediate',
      prop.preferredTenants || 'Any',
      prop.zeroBrokerage ?? true,
      prop.isVerified ?? true,
      prop.isFeatured ?? false,
      prop.description || '',
      prop.ownerName || 'Direct Owner',
      prop.ownerPhone || '',
      prop.ownerType || 'Direct Owner',
      JSON.stringify(prop.amenities || ['Power Backup', 'Lift', 'Car Parking', '24/7 Security']),
      JSON.stringify(prop.images || ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"]),
      JSON.stringify(prop.proximity || {})
    ]);

    const createdProp = formatPropertyRow(result.rows[0]);
    res.status(201).json(createdProp);
  } catch (err) {
    console.error('Error creating property in DB:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a property (Admin Only)
app.put('/api/properties/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const prop = req.body;

    const updateQuery = `
      UPDATE properties SET
        title = COALESCE($2, title),
        locality = COALESCE($3, locality),
        address = COALESCE($4, address),
        price = COALESCE($5, price),
        deposit = COALESCE($6, deposit),
        bhk = COALESCE($7, bhk),
        bhk_type = COALESCE($8, bhk_type),
        type = COALESCE($9, type),
        furnishing = COALESCE($10, furnishing),
        sqft = COALESCE($11, sqft),
        bathrooms = COALESCE($12, bathrooms),
        floor = COALESCE($13, floor),
        facing = COALESCE($14, facing),
        available_from = COALESCE($15, available_from),
        preferred_tenants = COALESCE($16, preferred_tenants),
        zero_brokerage = COALESCE($17, zero_brokerage),
        is_verified = COALESCE($18, is_verified),
        is_featured = COALESCE($19, is_featured),
        description = COALESCE($20, description),
        owner_name = COALESCE($21, owner_name),
        owner_phone = COALESCE($22, owner_phone),
        owner_type = COALESCE($23, owner_type),
        amenities = COALESCE($24, amenities),
        images = COALESCE($25, images),
        proximity = COALESCE($26, proximity)
      WHERE id = $1
      RETURNING *;
    `;

    const result = await query(updateQuery, [
      id,
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
      prop.bathrooms,
      prop.floor,
      prop.facing,
      prop.availableFrom,
      prop.preferredTenants,
      prop.zeroBrokerage,
      prop.isVerified,
      prop.isFeatured,
      prop.description,
      prop.ownerName,
      prop.ownerPhone,
      prop.ownerType,
      prop.amenities ? JSON.stringify(prop.amenities) : null,
      prop.images ? JSON.stringify(prop.images) : null,
      prop.proximity ? JSON.stringify(prop.proximity) : null
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(formatPropertyRow(result.rows[0]));
  } catch (err) {
    console.error('Error updating property in DB:', err);
    res.status(500).json({ error: err.message });
  }
});

// Toggle property flag (Admin Only)
app.patch('/api/properties/:id/toggle-flag', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { flagName } = req.body;

    const columnMap = {
      zeroBrokerage: 'zero_brokerage',
      isVerified: 'is_verified',
      isFeatured: 'is_featured'
    };

    const column = columnMap[flagName];
    if (!column) {
      return res.status(400).json({ error: 'Invalid flag name' });
    }

    const toggleQuery = `
      UPDATE properties 
      SET ${column} = NOT ${column}
      WHERE id = $1
      RETURNING *;
    `;

    const result = await query(toggleQuery, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(formatPropertyRow(result.rows[0]));
  } catch (err) {
    console.error('Error toggling property flag:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a property (Admin Only)
app.delete('/api/properties/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM property_images WHERE property_id = $1;', [id]);
    const result = await query('DELETE FROM properties WHERE id = $1 RETURNING id;', [id]);
    res.json({ success: true, message: `Property ${id} deleted`, deletedCount: result.rowCount });
  } catch (err) {
    console.error('Error deleting property from DB:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset properties to default (Clear all properties)
app.post('/api/properties/reset', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM properties;');
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Get leads (Admin Only)
app.get('/api/leads', requireAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM leads ORDER BY created_at DESC');
    const leads = result.rows.map(r => ({
      id: r.id,
      tenantName: r.tenant_name,
      tenantPhone: r.tenant_phone,
      propertyId: r.property_id,
      propertyTitle: r.property_title,
      locality: r.locality,
      status: r.status,
      notes: r.notes,
      date: r.date,
      createdAt: r.created_at
    }));
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const { tenantName, tenantPhone, propertyId, propertyTitle, locality, notes, status, date } = req.body;
    const id = req.body.id || `lead-${Date.now()}`;
    const leadDate = date || new Date().toISOString().split('T')[0];

    const insertQuery = `
      INSERT INTO leads (id, tenant_name, tenant_phone, property_id, property_title, locality, status, notes, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const result = await query(insertQuery, [
      id,
      tenantName,
      tenantPhone,
      propertyId || null,
      propertyTitle || '',
      locality || 'Bengaluru',
      status || 'New',
      notes || '',
      leadDate
    ]);

    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      tenantName: row.tenant_name,
      tenantPhone: row.tenant_phone,
      propertyId: row.property_id,
      propertyTitle: row.property_title,
      locality: row.locality,
      status: row.status,
      notes: row.notes,
      date: row.date,
      createdAt: row.created_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/leads/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const result = await query(
      `UPDATE leads 
       SET status = COALESCE($2, status), 
           notes = COALESCE($3, notes) 
       WHERE id = $1 
       RETURNING *;`,
      [id, status, notes]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    const row = result.rows[0];
    res.json({
      id: row.id,
      tenantName: row.tenant_name,
      tenantPhone: row.tenant_phone,
      propertyId: row.property_id,
      propertyTitle: row.property_title,
      locality: row.locality,
      status: row.status,
      notes: row.notes,
      date: row.date,
      createdAt: row.created_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/leads/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM leads WHERE id = $1', [id]);
    res.json({ success: true, message: `Lead ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// USER AUTHENTICATION & REGISTRATION API
// -------------------------------------------------------------

app.get('/api/users', requireAdmin, async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, provider, avatar, is_admin, created_at FROM users;');
    res.json(result.rows.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      provider: u.provider,
      avatar: u.avatar,
      isAdmin: Boolean(u.is_admin),
      createdAt: u.created_at
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanEmail === 'vramanarentals@gmail.com') {
      return res.status(400).json({ success: false, message: 'This email is reserved for Admin login.' });
    }

    const existing = await query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
    }

    const userId = `usr-${Date.now()}`;
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`;
    const hashedPassword = await bcrypt.hash(cleanPass, 10);

    const result = await query(
      `INSERT INTO users (id, name, email, password, provider, avatar, is_admin)
       VALUES ($1, $2, $3, $4, 'Email & Password', $5, FALSE)
       RETURNING id, name, email, provider, avatar, is_admin;`,
      [userId, name.trim(), cleanEmail, hashedPassword, avatar]
    );

    const user = result.rows[0];
    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar,
        isAdmin: false
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/verify-token', (req, res) => {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'];
  const token = authHeader?.replace('Bearer ', '');
  if (verifyAdminToken(token)) {
    return res.json({ valid: true, email: ADMIN_EMAIL, role: 'admin' });
  }
  return res.status(401).json({ valid: false, message: 'Invalid or expired admin session.' });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check admin credentials against environment config
    if (cleanEmail === ADMIN_EMAIL) {
      const adminRes = await query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
      const dbPass = adminRes.rows.length > 0 ? adminRes.rows[0].password : null;
      let isMatch = false;
      if (cleanPass === ADMIN_PASSWORD) {
        isMatch = true;
      } else if (dbPass) {
        if (dbPass.startsWith('$2a$') || dbPass.startsWith('$2b$')) {
          isMatch = await bcrypt.compare(cleanPass, dbPass);
        } else {
          isMatch = (cleanPass === dbPass);
        }
      }

      if (isMatch) {
        const adminRow = adminRes.rows[0] || {};
        const adminToken = generateAdminToken(cleanEmail);
        const adminSession = {
          id: adminRow.id || 'usr-admin',
          name: adminRow.name || 'V. RAMANA (Proprietor)',
          email: ADMIN_EMAIL,
          provider: 'Admin Account',
          avatar: adminRow.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=VRamana',
          isAdmin: true
        };
        return res.json({
          success: true,
          user: adminSession,
          isAdmin: true,
          token: adminToken
        });
      }
    }

    const userRes = await query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
    if (userRes.rows.length > 0) {
      const u = userRes.rows[0];
      let passwordMatch = false;
      if (u.password && (u.password.startsWith('$2a$') || u.password.startsWith('$2b$'))) {
        passwordMatch = await bcrypt.compare(cleanPass, u.password);
      } else {
        if (cleanPass === u.password) {
          passwordMatch = true;
          // Seamless legacy plaintext to bcrypt migration
          const upgradedHash = await bcrypt.hash(cleanPass, 10);
          await query('UPDATE users SET password = $1 WHERE id = $2', [upgradedHash, u.id]);
        }
      }

      if (passwordMatch) {
        return res.json({
          success: true,
          user: {
            id: u.id,
            name: u.name,
            email: u.email,
            provider: u.provider,
            avatar: u.avatar,
            isAdmin: Boolean(u.is_admin)
          },
          isAdmin: Boolean(u.is_admin)
        });
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// CONTACT & BUSINESS SETTINGS API
// -------------------------------------------------------------

app.get('/api/contact', async (req, res) => {
  try {
    const result = await query('SELECT * FROM contact_settings WHERE id = $1', ['main']);
    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.json({
        name: row.name,
        proprietor: row.proprietor,
        role: row.role,
        phone: row.phone,
        phoneRaw: row.phone_raw,
        whatsapp: row.whatsapp,
        email: row.email,
        address: row.address,
        locality: row.locality,
        slogan: row.slogan,
        services: typeof row.services === 'string' ? JSON.parse(row.services) : (row.services || [])
      });
    } else {
      res.status(404).json({ error: 'Contact settings not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/contact', requireAdmin, async (req, res) => {
  try {
    const c = req.body;
    const updateQuery = `
      INSERT INTO contact_settings (
        id, name, proprietor, role, phone, phone_raw, whatsapp, email, address, locality, slogan, services, updated_at
      ) VALUES (
        'main', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP
      ) ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        proprietor = EXCLUDED.proprietor,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        phone_raw = EXCLUDED.phone_raw,
        whatsapp = EXCLUDED.whatsapp,
        email = EXCLUDED.email,
        address = EXCLUDED.address,
        locality = EXCLUDED.locality,
        slogan = EXCLUDED.slogan,
        services = EXCLUDED.services,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const result = await query(updateQuery, [
      c.name,
      c.proprietor,
      c.role,
      c.phone,
      c.phoneRaw,
      c.whatsapp,
      c.email,
      c.address,
      c.locality,
      c.slogan,
      JSON.stringify(c.services || [])
    ]);

    const row = result.rows[0];
    res.json({
      name: row.name,
      proprietor: row.proprietor,
      role: row.role,
      phone: row.phone,
      phoneRaw: row.phone_raw,
      whatsapp: row.whatsapp,
      email: row.email,
      address: row.address,
      locality: row.locality,
      slogan: row.slogan,
      services: typeof row.services === 'string' ? JSON.parse(row.services) : (row.services || [])
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lazy DB initialization state for Vercel serverless execution
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (e) {
      console.error('Lazy DB initialization error:', e.message);
    }
  }
  next();
});

// Start Express Server locally
if (!process.env.VERCEL) {
  await initializeDatabase().catch(err => console.error('Failed DB init:', err));
  app.listen(PORT, () => {
    console.log(`🚀 PostgreSQL Neon REST API server running on http://localhost:${PORT}`);
  });
}

export default app;
