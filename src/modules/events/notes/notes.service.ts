import { prisma } from "../../../db/prisma.js";
import type { FlockNote } from "../../../generated/prisma/client.js";
import AppError from "../../../utils/appError.js";
import { flockService } from "../../flock/flock.service.js";

class NoteService {
  public async createFlockNote(
    flockId: string,
    ownerId: string,
    content: string,
  ): Promise<FlockNote> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    if (!content?.trim()) {
      throw new AppError("Note content cannot be empty", 400);
    }

    return prisma.flockNote.create({
      data: {
        flockId,
        content: content.trim(),
      },
    });
  }

  public async updateFlockNote(
    flockId: string,
    ownerId: string,
    noteId: string,
    content: string,
  ): Promise<FlockNote> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    if (!content?.trim()) {
      throw new AppError("Note content cannot be empty", 400);
    }

    const note = await prisma.flockNote.findFirst({
      where: {
        id: noteId,
        flockId,
      },
    });

    if (!note) {
      throw new AppError("Note not found", 404);
    }

    return prisma.flockNote.update({
      where: {
        id: noteId,
      },
      data: {
        content: content.trim(),
      },
    });
  }

  public async deleteFlockNote(
    flockId: string,
    ownerId: string,
    noteId: string,
  ): Promise<void> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    const note = await prisma.flockNote.findFirst({
      where: {
        id: noteId,
        flockId,
      },
    });

    if (!note) {
      throw new AppError("Note not found", 404);
    }

    await prisma.flockNote.delete({
      where: {
        id: noteId,
      },
    });
  }

  public async getFlockNotes(
    flockId: string,
    ownerId: string,
  ): Promise<FlockNote[]> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    return prisma.flockNote.findMany({
      where: {
        flockId,
      },
      orderBy: {
        recordedAt: "desc",
      },
    });
  }

  public async getFlockNote(
    flockId: string,
    ownerId: string,
    noteId: string,
  ): Promise<FlockNote | null> {
    await flockService.ensureOwnedFlock(flockId, ownerId);

    const note = prisma.flockNote.findFirst({
      where: {
        id: noteId,
        flockId,
      },
    });

    if (!note) throw new AppError("Note not found", 404);

    return note;
  }
}

export const noteService = new NoteService();
