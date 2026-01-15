import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import fs from "fs";

const { Pool } = pg;

function getDatabaseUrl(): string {
  console.log("[Database] Looking for database connection...");
  console.log("[Database] NODE_ENV:", process.env.NODE_ENV);
  
  // Check /tmp/replitdb first (used in production deployments)
  try {
    const replitDbPath = '/tmp/replitdb';
    console.log("[Database] Checking", replitDbPath, "exists:", fs.existsSync(replitDbPath));
    if (fs.existsSync(replitDbPath)) {
      const url = fs.readFileSync(replitDbPath, 'utf-8').trim();
      if (url) {
        console.log("[Database] Using /tmp/replitdb connection");
        return url;
      }
    }
  } catch (e: any) {
    console.log("[Database] Error reading /tmp/replitdb:", e.message);
  }
  
  // Fall back to environment variable
  console.log("[Database] DATABASE_URL set:", !!process.env.DATABASE_URL);
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
