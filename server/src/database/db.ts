import mysql from 'mysql2/promise';
import { DB_CONFIG } from '../config';

// --- Global Connection Pool ---
export const pool = mysql.createPool(DB_CONFIG);

// --- Manual Connection Check with Retry Logic ---
export const connectDB = async (): Promise<void> => {
  const maxRetries = 5;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const conn = await pool.getConnection();
      console.log('[DB] Connection successful');
      conn.release();
      return;
    } catch (err) {
      attempts++;
      console.warn(`[DB] Connection failed (attempt ${attempts})`);

      if (attempts === maxRetries) {
        console.error('[DB] Could not connect to the database after max retries:', err);
        throw err;
      }

      await new Promise(res => setTimeout(res, 1000)); // wait 1s before retry
    }
  }
};

// --- Optional: Graceful Shutdown (to use in server.ts) ---
export const closeDB = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('[DB] Connection pool closed gracefully');
  } catch (err) {
    console.error('[DB] Error closing the pool:', err);
  }
};
