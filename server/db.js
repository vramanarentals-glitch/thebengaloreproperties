import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const rawConnectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_x2EBuTd0tjhS@ep-floral-scene-avevp6xe-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require';
// Ensure channel_binding=require is stripped if present to avoid SCRAM issues on Windows
const connectionString = rawConnectionString.replace(/&channel_binding=require/g, '').replace(/\?channel_binding=require&/g, '?');

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 10000,
  keepAlive: true
});

pool.on('error', (err) => {
  console.warn('Neon DB idle pool warning:', err.message);
});

export async function query(text, params, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (error) {
      const isTransient = 
        error.message?.includes('Connection terminated') ||
        error.message?.includes('ECONNRESET') ||
        error.message?.includes('timeout') ||
        error.message?.includes('ENOTFOUND') ||
        error.code === '57P01'; // Neon serverless idle wake-up / admin shutdown

      if (isTransient && attempt < retries) {
        console.warn(`Neon DB transient error on attempt ${attempt}/${retries}: ${error.message}. Retrying query in 600ms...`);
        await new Promise(r => setTimeout(r, 600));
        continue;
      }
      console.error('Database query error:', { text, error: error.message });
      throw error;
    }
  }
}
