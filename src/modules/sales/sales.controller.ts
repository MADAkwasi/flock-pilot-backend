import type { Request, Response } from "express";

import { saleService } from "./sales.service.js";

import { queryParamSchema, salesParamSchema } from "./sales.schema.js";
import { farmParamSchema } from "../farm/farm.scheme.js";

export class SalesController {
  static async createSaleRecord(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { farmId } = farmParamSchema.parse(req.params);

    const saleRecord = await saleService.createFarmSaleRecord(
      farmId,
      userId,
      body,
    );

    res.status(201).json({
      status: "success",
      message: "Sale record created successfully",
      data: {
        sale: saleRecord,
      },
    });
  }

  static async getSalesRecordHistory(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId } = req;
    const { farmId } = farmParamSchema.parse(req.params);
    const { flockId } = queryParamSchema.parse(req.query);

    const salesHistory = await saleService.getSalesRecordHistory(
      farmId,
      userId,
      flockId ?? undefined,
    );

    res.status(200).json({
      status: "success",
      results: salesHistory.length,
      data: {
        sales: salesHistory,
      },
    });
  }

  static async getSaleRecord(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { farmId, salesId } = salesParamSchema.parse(req.params);

    const saleRecord = await saleService.getSaleRecord(farmId, userId, salesId);

    res.status(200).json({
      status: "success",
      data: {
        sale: saleRecord,
      },
    });
  }

  static async updateSaleRecord(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { farmId, salesId } = salesParamSchema.parse(req.params);

    const updatedSale = await saleService.updateSaleRecord(
      farmId,
      userId,
      salesId,
      body,
    );

    res.status(200).json({
      status: "success",
      message: "Sale record updated successfully",
      data: {
        sale: updatedSale,
      },
    });
  }

  static async deleteSaleRecord(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { farmId, salesId } = salesParamSchema.parse(req.params);

    await saleService.deleteSaleRecord(farmId, userId, salesId);

    res.status(200).json({
      status: "success",
      message: "Sale record deleted successfully",
    });
  }
}
