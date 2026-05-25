import z from "zod";

export const createMortalityRecordSchema = z
  .object({
    count: z.number().min(1),
    cause: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

export const mortalityRecordParamSchema = z.object({
  flockId: z.uuid(),
  recordId: z.uuid(),
});

export type MortalityRecordDto = z.infer<typeof createMortalityRecordSchema>;
