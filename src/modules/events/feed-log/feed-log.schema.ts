import z from "zod";

export const createFeedLogSchema = z.object({
  feedType: z.string().min(3),
  quantityKg: z.number(),
  notes: z.string().min(3).optional(),
});

export const updateFeedLogSchema = z.object({
  feedType: z.string().min(3).optional(),
  quantityKg: z.number().optional(),
  notes: z.string().min(3).optional(),
});

export const feedLogParamsSchema = z.object({
  flockId: z.uuid(),
  feedLogId: z.uuid(),
});

export type UpdateFeedLogDto = z.infer<typeof updateFeedLogSchema>;
export type CreateFeedDto = z.infer<typeof createFeedLogSchema>;
