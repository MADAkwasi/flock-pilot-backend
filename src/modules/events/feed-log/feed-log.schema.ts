import z from "zod";

export const createFeedLogSchema = z.object({
  feedType: z.string().min(3),
  quantityKg: z.number(),
  notes: z.string().min(3).optional(),
});

export const feedLogParamsSchema = z.object({
  flockId: z.uuid(),
  feedLogId: z.uuid(),
});

export type CreateFeedDto = z.infer<typeof createFeedLogSchema>;
