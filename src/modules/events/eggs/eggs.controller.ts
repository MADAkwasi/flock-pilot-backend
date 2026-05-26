import type { Response, Request } from "express";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { eggProductionService } from "./eggs.service.js";

export class EggProductionController {
  static async recordEggProduction(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const eggProduction = await eggProductionService.createEggProduction(
      flockId,
      userId,
      body,
    );

    res.status(201).json({
      status: "success",
      data: {
        eggs: eggProduction,
      },
    });
  }
}
