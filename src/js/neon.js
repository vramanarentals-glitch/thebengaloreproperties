import { neon } from '@neondatabase/serverless';

// Get Neon Connection URL from Vite env or default user Neon key
export const NEON_CONNECTION_STRING = 
  import.meta.env.VITE_NEON_DATABASE_URL || 
  "postgresql://neondb_owner:npg_oLn8TVaOjS9e@ep-lively-waterfall-axd203l9-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

let sqlInstance = null;

export function getNeonSql() {
  if (!sqlInstance) {
    sqlInstance = neon(NEON_CONNECTION_STRING);
  }
  return sqlInstance;
}

/**
 * Fetch all properties from Neon PostgreSQL
 */
export async function fetchNeonProperties() {
  try {
    const sql = getNeonSql();
    const rows = await sql`
      SELECT * FROM properties ORDER BY id DESC;
    `;
    
    // Map column names to JS object
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      price: Number(r.price),
      locality: r.locality,
      address: r.address,
      bhk: r.bhk,
      bhkType: r.bhktype || r.bhk,
      bathrooms: Number(r.bathrooms || 1),
      sqft: Number(r.sqft || 500),
      furnishing: r.furnishing,
      tenantType: r.tenanttype,
      deposit: Number(r.deposit || 0),
      availableFrom: r.availablefrom,
      description: r.description,
      isVerified: Boolean(r.isverified),
      isFeatured: Boolean(r.isfeatured),
      zeroBrokerage: Boolean(r.zerobrokerage),
      images: Array.isArray(r.images) ? r.images : (typeof r.images === 'string' ? JSON.parse(r.images) : []),
      amenities: Array.isArray(r.amenities) ? r.amenities : (typeof r.amenities === 'string' ? JSON.parse(r.amenities) : []),
      contact: {
        name: r.contactname || 'V. RAMANA',
        phone: r.contactphone || '+91 80504 07710',
        whatsapp: r.contactwhatsapp || '+918050407710'
      }
    }));
  } catch (err) {
    console.error('❌ Neon PostgreSQL fetch properties failed:', err);
    return null;
  }
}

/**
 * Save or update property in Neon PostgreSQL
 */
export async function saveNeonProperty(p) {
  try {
    const sql = getNeonSql();
    const propId = p.id || `prop-custom-${Date.now()}`;
    const imagesJson = JSON.stringify(p.images || []);
    const amenitiesJson = JSON.stringify(p.amenities || []);
    const contactName = p.contact?.name || 'V. RAMANA';
    const contactPhone = p.contact?.phone || '+91 80504 07710';
    const contactWhatsapp = p.contact?.whatsapp || '+918050407710';

    await sql`
      INSERT INTO properties (
        id, title, price, locality, address, bhk, bhktype, bathrooms, sqft,
        furnishing, tenanttype, deposit, availablefrom, description,
        isverified, isfeatured, zerobrokerage, images, amenities,
        contactname, contactphone, contactwhatsapp, updatedat
      ) VALUES (
        ${propId}, ${p.title || ''}, ${p.price || 0}, ${p.locality || ''}, ${p.address || ''}, 
        ${p.bhk || ''}, ${p.bhkType || p.bhk || ''}, ${p.bathrooms || 1}, ${p.sqft || 500},
        ${p.furnishing || 'Semi-Furnished'}, ${p.tenantType || 'Family / Bachelors'}, 
        ${p.deposit || 0}, ${p.availableFrom || 'Immediate'}, ${p.description || ''},
        ${p.isVerified ?? true}, ${p.isFeatured ?? true}, ${p.zeroBrokerage ?? true}, 
        ${imagesJson}, ${amenitiesJson},
        ${contactName}, ${contactPhone}, ${contactWhatsapp}, CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        price = EXCLUDED.price,
        locality = EXCLUDED.locality,
        address = EXCLUDED.address,
        bhk = EXCLUDED.bhk,
        bhktype = EXCLUDED.bhktype,
        bathrooms = EXCLUDED.bathrooms,
        sqft = EXCLUDED.sqft,
        furnishing = EXCLUDED.furnishing,
        tenanttype = EXCLUDED.tenanttype,
        deposit = EXCLUDED.deposit,
        availablefrom = EXCLUDED.availablefrom,
        description = EXCLUDED.description,
        isverified = EXCLUDED.isverified,
        isfeatured = EXCLUDED.isfeatured,
        zerobrokerage = EXCLUDED.zerobrokerage,
        images = EXCLUDED.images,
        amenities = EXCLUDED.amenities,
        contactname = EXCLUDED.contactname,
        contactphone = EXCLUDED.contactphone,
        contactwhatsapp = EXCLUDED.contactwhatsapp,
        updatedat = CURRENT_TIMESTAMP;
    `;
    console.log(`✅ Property ${propId} synced to Neon PostgreSQL Database!`);
    return true;
  } catch (err) {
    console.error('❌ Save to Neon PostgreSQL failed:', err);
    return false;
  }
}

/**
 * Delete property from Neon PostgreSQL
 */
export async function deleteNeonProperty(propertyId) {
  try {
    const sql = getNeonSql();
    await sql`DELETE FROM properties WHERE id = ${propertyId};`;
    console.log(`🗑️ Property ${propertyId} deleted from Neon PostgreSQL!`);
    return true;
  } catch (err) {
    console.error('❌ Delete from Neon PostgreSQL failed:', err);
    return false;
  }
}

/**
 * Fetch tenant leads from Neon PostgreSQL
 */
export async function fetchNeonLeads() {
  try {
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM leads ORDER BY createdat DESC;`;
    return rows.map(r => ({
      id: r.id,
      tenantName: r.tenantname,
      tenantPhone: r.tenantphone,
      propertyTitle: r.propertytitle,
      locality: r.locality,
      date: r.date,
      status: r.status,
      notes: r.notes
    }));
  } catch (err) {
    console.error('❌ Fetch leads from Neon failed:', err);
    return null;
  }
}

/**
 * Save tenant lead to Neon PostgreSQL
 */
export async function saveNeonLead(lead) {
  try {
    const sql = getNeonSql();
    const leadId = lead.id || `lead-${Date.now()}`;
    await sql`
      INSERT INTO leads (id, tenantname, tenantphone, propertytitle, locality, date, status, notes)
      VALUES (${leadId}, ${lead.tenantName || ''}, ${lead.tenantPhone || ''}, ${lead.propertyTitle || ''}, ${lead.locality || ''}, ${lead.date || ''}, ${lead.status || 'New'}, ${lead.notes || ''})
      ON CONFLICT (id) DO UPDATE SET
        tenantname = EXCLUDED.tenantname,
        tenantphone = EXCLUDED.tenantphone,
        propertytitle = EXCLUDED.propertytitle,
        locality = EXCLUDED.locality,
        date = EXCLUDED.date,
        status = EXCLUDED.status,
        notes = EXCLUDED.notes;
    `;
    return true;
  } catch (err) {
    console.error('❌ Save lead to Neon failed:', err);
    return false;
  }
}

/**
 * Delete tenant lead from Neon PostgreSQL
 */
export async function deleteNeonLead(leadId) {
  try {
    const sql = getNeonSql();
    await sql`DELETE FROM leads WHERE id = ${leadId};`;
    return true;
  } catch (err) {
    console.error('❌ Delete lead from Neon failed:', err);
    return false;
  }
}
