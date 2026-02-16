import { AnyElysia, Elysia } from "elysia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BlockChain } from "../../src/domain/blockchain";
import { BlockChainService } from "../../src/domain/blockchain.service";
import { createEnrollRoute } from "../../src/routes/api/enroll.route";
import { FileRecord } from "../../src/routes/payloads/fileRecord";
import { Block } from "../../src/domain/block";
import { BlockRepository } from "../../src/infrastructure/block.repository";

const mockBlockRepository = {
  findAll: vi.fn().mockResolvedValue([]),
  create: vi.fn(),
} as unknown as BlockRepository;

describe("POST /api/enroll", () => {
  let app: AnyElysia;
  let blockChain: BlockChain<FileRecord>;
  let blockChainService: BlockChainService;

  beforeEach(() => {
    blockChain = new BlockChain();
    blockChainService = new BlockChainService(blockChain, mockBlockRepository);

    app = new Elysia().use(createEnrollRoute(blockChainService));
  });

  it("should return fulfilled status", async () => {
    const payload = {
      fileHash:
        "5cf35f3f6ff897f2bdde5a25a9616223ae2327746b723e3691060fa610780815",
      fileName: "document.pdf",
      fileSize: 2097152,
      mimeType: "application/pdf",
      updatedAt: 1771068600000,
    };

    const response = await app.handle(
      new Request("http://localhost:3000/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json.status).toEqual("fulfilled");
    expect(json.data).toBeDefined();
  });

  it("should add block to chain", async () => {
    const payload = {
      fileHash:
        "4ee84a82b5e4c9e6651b13fd27dcf615e427ec584929f2cef7167aa99151a77a",
      fileName: "image.png",
      fileSize: 2097152,
      mimeType: "image/png",
      updatedAt: 1771068600000,
    };

    await app.handle(
      new Request("http://localhost:3000/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    const lastBlock = blockChain.blocks[blockChain.blocks.length - 1];
    expect(lastBlock.data).toBeDefined();

    expect(lastBlock.data.fileHash).toEqual(payload.fileHash);
    expect(lastBlock.data.fileName).toEqual(payload.fileName);
    expect(lastBlock.data.fileSize).toEqual(payload.fileSize);
  });

  it("shouldn't add block to chain", async () => {
    const payload = {
      fileHash:
        "5cf35f3f6ff897f2bdde5a25a9616223ae2327746b723e3691060fa610780815",
      fileName: "document.pdf",
      fileSize: 2097152,
      mimeType: "application/pdf",
      updatedAt: 1771068600000,
    };

    const block = new Block(payload, new Date().getTime() + 86400);
    blockChain.addNewBlock(block);

    const response = await app.handle(
      new Request("http://localhost:3000/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(409);

    const json = await response.json();
    expect(json.status).toEqual("rejected");
    expect(json.message).toEqual("Block Already Exists");
  });
});
