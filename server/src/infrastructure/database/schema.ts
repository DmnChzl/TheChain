import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const blockTable = sqliteTable("block", {
  data: text("data", { mode: "json" }).notNull(),
  hash: text("hash").primaryKey(),
  prevHash: text("prev_hash").notNull(),
  timestamp: integer("timestamp").notNull(),
});

export type BlockSQLiteTable = typeof blockTable;
export type BlockEntity = typeof blockTable.$inferSelect;
