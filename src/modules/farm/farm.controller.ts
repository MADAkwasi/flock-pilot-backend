import type { Request, Response } from "express";
import { farmService } from "./farm.service.js";
import { farmParamSchema } from "./farm.scheme.js";

export class FarmController {
  static async createFarm(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;

    const farm = await farmService.createFarm(userId, body);

    res.status(201).json({
      status: "success",
      data: {
        farm,
      },
    });
  }

  static async getMyFarms(req: Request, res: Response): Promise<void> {
    const { userId } = req;

    const farms = await farmService.getUserFarms(userId);

    res.status(200).json({
      status: "success",
      results: farms.length,
      data: {
        farms,
      },
    });
  }

  static async getFarm(req: Request, res: Response): Promise<void> {
    const { farmId } = farmParamSchema.parse(req.params);
    const { userId } = req;

    const farm = await farmService.getFarmUserById(farmId, userId);

    res.status(200).json({
      status: "success",
      data: {
        farm,
      },
    });
  }

  static async updateFarm(req: Request, res: Response): Promise<void> {
    const { farmId } = farmParamSchema.parse(req.params);
    const { body, userId } = req;

    const farm = await farmService.updateFarmInfo(farmId, userId, body);

    res.status(200).json({
      status: "success",
      data: {
        farm,
      },
    });
  }

  static async deactivate(req: Request, res: Response): Promise<void> {
    const { farmId } = farmParamSchema.parse(req.params);
    const { userId } = req;

    await farmService.deactivateFarm(farmId, userId);

    res.status(200).json({
      status: "success",
      message: "Farm deleted successfully",
    });
  }

  static async activate(req: Request, res: Response): Promise<void> {
    const { farmId } = farmParamSchema.parse(req.params);
    const { userId } = req;

    const farm = await farmService.activateFarm(farmId, userId);

    res.status(200).json({
      status: "success",
      message: "Farm activated successfully",
      data: {
        farm,
      },
    });
  }

  static async getFarmDashboard(req: Request, res: Response): Promise<void> {
    const { farmId } = farmParamSchema.parse(req.params);
    const { userId } = req;

    const dashboard = await farmService.getFarmDashboard(farmId, userId);

    res.status(200).json({
      status: "success",
      data: {
        dashboard,
      },
    });
  }
}
