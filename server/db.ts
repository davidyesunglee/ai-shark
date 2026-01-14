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

// For Replit production, the connection string already includes all necessary config
// Don't add additional SSL settings as they may conflict
export const pool = new Pool({ 
  connectionString,
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 60000,
});

pool.on('error', (err) => {
  console.error('[Database] Unexpected pool error:', err.message);
});

export const db = drizzle(pool, { schema });
