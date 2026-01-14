import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import fs from "fs";

const { Pool } = pg;

function getDatabaseUrl(): string {
  // Check /tmp/replitdb first (used in production deployments)
  try {
    if (fs.existsSync('/tmp/replitdb')) {
      const url = fs.readFileSync('/tmp/replitdb', 'utf-8').trim();
      if (url) {
        console.log("[Database] Using /tmp/replitdb connection");
        return url;
      }
    }
  } catch (e) {
    // Fall through to environment variable
  }
  
  // Fall back to environment variable
  if (process.env.DATABASE_URL) {
    console.log("[Database] Using DATABASE_URL environment variable");
    return process.env.DATABASE_URL;
  }
  
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const connectionString = getDatabaseUrl();
const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({ 
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 5,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 30000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[Database] Unexpected pool error:', err.message);
});

pool.on('connect', () => {
  console.log('[Database] New client connected to pool');
});

export const db = drizzle(pool, { schema });
