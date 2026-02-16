import type { BlockRepository } from "../infrastructure/block.repository";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  StatusError,
} from "../routes/exceptions/statusError";
import type { BlockChainState } from "../routes/payloads/blockchainState";
import type { EnrollmentResult } from "../routes/payloads/enrollmentResult";
import type { FileRecord } from "../routes/payloads/fileRecord";
import type { VerificationResult } from "../routes/payloads/verificationResult";
import { Left, Right, type Either } from "../utils/either";
import { Block } from "./block";
import { BlockChain } from "./blockchain";

export class BlockChainService {
  #chain: BlockChain<FileRecord>;
  #repository: BlockRepository;

  constructor(chain: BlockChain<FileRecord>, repository: BlockRepository) {
    this.#chain = chain;
    this.#repository = repository;
  }

  async setup() {
    const entities = await this.#repository.findAll();

    if (entities.length === 0) {
      const genesisBlock = this.#chain.getGenesisBlock();

      await this.#repository.create({
        data: genesisBlock.data,
        hash: genesisBlock.hash,
        prevHash: genesisBlock.prevHash,
        timestamp: genesisBlock.timestamp,
      });
    } else {
      this.#chain.blocks = entities.map((entity) => {
        const block = new Block<FileRecord>(
          entity.data as FileRecord,
          entity.timestamp,
        );

        block.prevHash = entity.prevHash;
        block.hash = entity.hash;

        // This Is Immutability
        return Object.freeze(block);
      });
    }
  }

  getBlockChainState(): Either<StatusError, BlockChainState<FileRecord>> {
    try {
      const blocks = this.#chain.blocks.map((block, index) => ({
        index,
        data: block.data,
        hash: block.hash,
        prevHash: block.prevHash,
        timestamp: block.timestamp,
      }));

      return Right.create({
        blocks,
        isValid: this.#chain.isValid(),
        totalBlocks: this.#chain.getBlockCount(),
      });
    } catch (error) {
      return Left.create(new InternalServerError((error as Error).message));
    }
  }

  #findBlock(fileHash: string): {
    index: number;
    block: Block<FileRecord> | undefined;
  } {
    for (let i = 0; i < this.#chain.blocks.length; i++) {
      const block = this.#chain.blocks[i];
      if (!block) {
        throw new Error(`Corrupted BlockChain (Index: ${i})`);
      }

      if (block.data.fileHash === fileHash) {
        return { index: i, block };
      }
    }
    return { index: -1, block: undefined };
  }

  async enrollFile(
    record: FileRecord,
  ): Promise<Either<StatusError, EnrollmentResult>> {
    try {
      const { block: existingBlock } = this.#findBlock(record.fileHash);

      if (existingBlock) {
        return Left.create(new ConflictError("Block Already Exists"));
      }

      const newBlock = new Block<FileRecord>(record, new Date().getTime());
      this.#chain.addNewBlock(newBlock);

      await this.#repository.create({
        data: newBlock.data,
        hash: newBlock.hash,
        prevHash: newBlock.prevHash,
        timestamp: newBlock.timestamp,
      });

      return Right.create({
        blockHash: newBlock.hash,
        blockIndex: this.#chain.getBlockCount() - 1,
        timestamp: newBlock.timestamp,
        totalBlocks: this.#chain.getBlockCount(),
      });
    } catch (error) {
      return Left.create(new InternalServerError((error as Error).message));
    }
  }

  verifyFile(fileHash: string): Either<StatusError, VerificationResult> {
    try {
      const isChainValid = this.#chain.isValid();
      const { block, index: blockIndex } = this.#findBlock(fileHash);

      if (!block) {
        return Left.create(new NotFoundError("Block Not Found"));
      }

      return Right.create({
        blockHash: block.hash,
        blockIndex,
        fileName: block.data.fileName,
        isChainValid,
        timestamp: block.timestamp,
      });
    } catch (error) {
      return Left.create(new InternalServerError((error as Error).message));
    }
  }
}
