import type { Request, Response } from "express";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { feedLogService } from "./feed.service.js";

export class FeedLogController {
  static async createFeedLog(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const log = await feedLogService.createFeedLog(userId, flockId, body);

    res.status(201).json({
      status: "message",
      data: {
        log,
      },
    });
  }
}
