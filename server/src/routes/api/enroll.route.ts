import Elysia from "elysia";
import type { BlockChainService } from "../../domain/blockchain.service";
import { fileRecordSchema } from "../payloads/fileRecord";

const ENROLL_PATH = "/api/enroll";

export const createEnrollRoute = (service: BlockChainService) => {
  return new Elysia({ prefix: ENROLL_PATH }).post(
    "/",
    async ({ body, set }) => {
      const result = await service.enrollFile(body);

      if (result.isLeft()) {
        set.status = result.error.statusCode;
        return { status: "rejected", message: result.error.message };
      }

      set.status = 201;
      return { status: "fulfilled", data: result.value };
    },
    { body: fileRecordSchema },
  );
};
