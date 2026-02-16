import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

export const client = new Database(process.env.DATABASE_URL || "db.sqlite");
export const database = drizzle({ client });

migrate(database, { migrationsFolder: "./drizzle" });
