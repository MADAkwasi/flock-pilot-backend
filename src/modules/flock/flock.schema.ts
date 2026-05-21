import z from "zod";

export const createFlockSchema = z.object({
  name: z.string().min(3),
  breed: z.string().optional(),
  quantity: z.number(),
});

export type FlockDto = z.infer<typeof createFlockSchema>;
