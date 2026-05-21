import z from "zod";

export const createFlockSchema = z.object({
  name: z.string().min(3),
  breed: z.string().optional(),
  flockType: z.enum(["LAYER", "BROILER"]),
  initialCount: z.number(),
  source: z.string().min(3).optional(),
  notes: z.string().min(5).optional(),
  startDate: z.coerce.date(),
});

export type FlockDto = z.infer<typeof createFlockSchema>;
