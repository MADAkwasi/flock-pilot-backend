import type { Response, Request } from "express";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { eggProductionService } from "./eggs.service.js";
import { eggProductionParamSchema } from "./eggs.schema.js";

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

  static async getEggProductionHistory(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId } = req;
    const { flockId } = flockParamsSchema.parse(req.params);

    const eggProductionHistory =
      await eggProductionService.getFlockEggProductionHistory(flockId, userId);

    res.status(200).json({
      status: "success",
      results: eggProductionHistory.length,
      data: {
        eggs: eggProductionHistory,
      },
    });
  }

  static async getEggProduction(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { flockId, productionId } = eggProductionParamSchema.parse(
      req.params,
    );

    const eggProduction = await eggProductionService.getFlockEggProduction(
      flockId,
      userId,
      productionId,
    );

    res.status(200).json({
      status: "success",
      data: {
        eggs: eggProduction,
      },
    });
  }

  static async deleteEggProductionRecord(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId } = req;
    const { flockId, productionId } = eggProductionParamSchema.parse(
      req.params,
    );

    await eggProductionService.deleteFlockEggProduction(
      flockId,
      userId,
      productionId,
    );

    res.status(200).json({
      status: "success",
      message:
        "Egg production record deleted successfully. Egg inventory updated",
    });
  }

  static async updateEggProductionRecord(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId, body } = req;
    const { flockId, productionId } = eggProductionParamSchema.parse(
      req.params,
    );

    const eggProduction = await eggProductionService.updateEggProduction(
      flockId,
      userId,
      productionId,
      body,
    );

    res.status(200).json({
      status: "success",
      data: {
        egg: eggProduction,
      },
    });
  }
}
