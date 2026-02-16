import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type { BlockEntity, BlockSQLiteTable } from "./database/schema";

export class BlockRepository {
  #database: BunSQLiteDatabase;
  #table: BlockSQLiteTable;

  constructor(database: BunSQLiteDatabase, table: BlockSQLiteTable) {
    this.#database = database;
    this.#table = table;
  }

  async findAll(): Promise<BlockEntity[]> {
    return await this.#database.select().from(this.#table);
  }

  async create(entity: BlockEntity) {
    await this.#database.insert(this.#table).values({
      data: entity.data,
      hash: entity.hash,
      prevHash: entity.prevHash,
      timestamp: entity.timestamp,
    });
  }
}
