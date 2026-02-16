import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { BlockChain } from "./domain/blockchain";
import { BlockChainService } from "./domain/blockchain.service";
import { BlockRepository } from "./infrastructure/block.repository";
import { database } from "./infrastructure/database/config";
import { blockTable } from "./infrastructure/database/schema";
import { createBlockChainRoute } from "./routes/api/blockchain.route";
import { createEnrollRoute } from "./routes/api/enroll.route";
import { createVerifyRoute } from "./routes/api/verify.route";
import type { FileRecord } from "./routes/payloads/fileRecord";

const blockRepository = new BlockRepository(database, blockTable);
const blockChain = new BlockChain<FileRecord>();
const blockChainService = new BlockChainService(blockChain, blockRepository);

blockChainService.setup();

const { server } = new Elysia()
  .use(
    cors({
      origin: "http://localhost:4200",
      allowedHeaders: ["Content-Type"],
      methods: ["GET", "POST"],
    }),
  )
  .get("/health", () => ({ message: "Healthy" }))
  .use(createBlockChainRoute(blockChainService))
  .use(createEnrollRoute(blockChainService))
  .use(createVerifyRoute(blockChainService))
  .listen(process.env["PORT"] || 3000);

// eslint-disable-next-line no-console
console.log(`
   +------+
  /      /|
 /      / |
+------+  +
| RUN: | /
| ${server?.port} |/
+------+
`);
