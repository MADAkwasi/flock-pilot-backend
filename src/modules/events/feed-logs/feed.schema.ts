import z from "zod";

export const createFeedLogSchema = z.object({
  feedType: z.string().min(3),
  quantityKg: z.number(),
  notes: z.string().min(3).optional(),
});

export type CreateFeedDto = z.infer<typeof createFeedLogSchema>;
