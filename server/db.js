import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_x2EBuTd0tjhS@ep-floral-scene-avevp6xe-pooler.c-11.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

export const pool = new Pool({
  connectionString,
  ssl: process.env.DB_SSL_STRICT === 'true'
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle Neon DB client:', err);
});

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    return res;
  } catch (error) {
    console.error('Database query error:', { text, error: error.message });
    throw error;
  }
}
