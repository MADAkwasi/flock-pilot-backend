import type { Request, Response } from "express";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { feedLogService } from "./feed-log.service.js";
import { feedLogParamsSchema } from "./feed-log.schema.js";

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

  static async getFeedLogs(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const logs = await feedLogService.getFlockFeedLogs(userId, flockId);

    res.status(201).json({
      status: "message",
      results: logs.length,
      data: {
        logs,
      },
    });
  }

  static async getFeedLog(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId, feedLogId } = feedLogParamsSchema.parse(req.params);

    const log = await feedLogService.getFeedLog(userId, flockId, feedLogId);

    res.status(200).json({
      status: "message",
      data: {
        log,
      },
    });
  }
}
