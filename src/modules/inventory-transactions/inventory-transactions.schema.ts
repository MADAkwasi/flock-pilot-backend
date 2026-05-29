import z from "zod";

export const transactionParamSchema = z.object({
  farmId: z.uuid(),
  transactionId: z.uuid(),
});
