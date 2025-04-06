import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";
import pg from "pg";

const { Pool } = pg;

// Create postgres connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create postgres client for drizzle
export const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Create pg Pool for connect-pg-simple session store
export const pool = new Pool({
  connectionString: connectionString,
});