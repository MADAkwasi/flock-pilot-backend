import z from "zod";

export const noteSchema = z
  .object({
    content: z.string(),
  })
  .strict();

export const notesParamSchema = z
  .object({
    flockId: z.uuid(),
    noteId: z.uuid(),
  })
  .strict();
