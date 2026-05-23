import z from "zod";

export const healthRecordParamSchema = z.object({
  flockId: z.uuid(),
  healthRecordId: z.uuid(),
});
