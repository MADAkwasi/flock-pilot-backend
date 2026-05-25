import z from "zod";
import { Severity } from "../../../generated/prisma/enums.js";

export const createHealthRecordSchema = z
  .object({
    diagnosis: z.string().min(2),
    severity: z.enum(Severity),
    treatment: z.string().optional(),
    medication: z.string().optional(),
    affectedCount: z.number().optional(),
    vetNotes: z.string().optional(),
    recordedAt: z.coerce.date(),
  })
  .strict();

export const updateHealthRecordSchema = z
  .object({
    diagnosis: z.string().min(2).optional(),
    severity: z.enum(Severity).optional(),
    treatment: z.string().optional(),
    medication: z.string().optional(),
    affectedCount: z.number().optional(),
    vetNotes: z.string().optional(),
    recordedAt: z.coerce.date().optional(),
  })
  .strict();

export const healthRecordParamSchema = z.object({
  flockId: z.uuid(),
  healthRecordId: z.uuid(),
});

export type UpdateHealthRecordDto = z.infer<typeof updateHealthRecordSchema>;
export type HealthRecordDto = z.infer<typeof createHealthRecordSchema>;
