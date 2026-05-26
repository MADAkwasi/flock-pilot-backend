import type { Response, Request } from "express";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { noteService } from "./notes.service.js";
import { notesParamSchema } from "./notes.schema.js";

export class NoteController {
  static async createNote(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const note = await noteService.createFlockNote(
      flockId,
      userId,
      body.content,
    );

    res.status(201).json({
      status: "success",
      data: {
        note,
      },
    });
  }

  static async getNotes(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const notes = await noteService.getFlockNotes(flockId, userId);

    res.status(201).json({
      status: "success",
      results: notes.length,
      data: {
        notes,
      },
    });
  }

  static async getNote(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId, noteId } = notesParamSchema.parse(req.params);

    const note = await noteService.getFlockNote(flockId, userId, noteId);

    res.status(200).json({
      status: "success",
      data: {
        note,
      },
    });
  }

  static async updateNote(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { flockId, noteId } = notesParamSchema.parse(req.params);

    const note = await noteService.updateFlockNote(
      flockId,
      userId,
      noteId,
      body.content,
    );

    res.status(200).json({
      status: "success",
      data: {
        note,
      },
    });
  }

  static async deleteNote(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId, noteId } = notesParamSchema.parse(req.params);

    await noteService.deleteFlockNote(flockId, userId, noteId);

    res.status(200).json({
      status: "success",
      message: "Note deleted successfully",
    });
  }
}
