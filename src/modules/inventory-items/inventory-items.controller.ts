import type { Request, Response } from "express";
import { inventoryItemService } from "./inventory-items.service.js";
import { farmParamSchema } from "../farm/farm.scheme.js";
import { inventoryItemParamSchema } from "./inventory-items.schema.js";

export class InventoryItemController {
  public static async createInventoryItem(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId, body } = req;
    const { farmId } = farmParamSchema.parse(req.params);

    const inventoryItem = await inventoryItemService.createInventoryItem(
      farmId,
      userId,
      body,
    );

    res.status(201).json({
      status: "success",
      data: {
        inventoryItem,
      },
    });
  }

  public static async getInventories(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId } = req;
    const { farmId } = farmParamSchema.parse(req.params);

    const inventoryItems = await inventoryItemService.getFarmInventories(
      farmId,
      userId,
    );

    res.status(200).json({
      status: "success",
      results: inventoryItems.length,
      data: {
        inventoryItems,
      },
    });
  }

  public static async getInventoryItem(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId } = req;
    const { farmId, inventoryItemId } = inventoryItemParamSchema.parse(
      req.params,
    );

    const inventoryItem = await inventoryItemService.getInventoryItem(
      farmId,
      userId,
      inventoryItemId,
    );

    res.status(200).json({
      status: "success",
      data: {
        inventoryItem,
      },
    });
  }

  public static async updateInventoryItem(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId, body } = req;
    const { farmId, inventoryItemId } = inventoryItemParamSchema.parse(
      req.params,
    );

    const inventoryItem = await inventoryItemService.updateInventoryItem(
      farmId,
      userId,
      inventoryItemId,
      body,
    );

    res.status(200).json({
      status: "success",
      data: {
        inventoryItem,
      },
    });
  }

  public static async deleteInventoryItem(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId } = req;
    const { farmId, inventoryItemId } = inventoryItemParamSchema.parse(
      req.params,
    );

    await inventoryItemService.deleteInventoryItem(
      farmId,
      userId,
      inventoryItemId,
    );

    res.status(200).json({
      status: "success",
      message: "Item removed from inventory",
    });
  }

  public static async clearInventoryStock(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId, body } = req;
    const { farmId, inventoryItemId } = inventoryItemParamSchema.parse(
      req.params,
    );

    await inventoryItemService.clearInventoryStock(
      farmId,
      userId,
      inventoryItemId,
      body,
    );

    res.status(200).json({
      status: "success",
      message: "Inventory stock cleared successfully",
    });
  }

  public static async adjustInventoryStock(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId, body } = req;
    const { farmId, inventoryItemId } = inventoryItemParamSchema.parse(
      req.params,
    );

    await inventoryItemService.adjustInventoryStock(
      farmId,
      userId,
      inventoryItemId,
      body,
    );

    res.status(200).json({
      status: "success",
      message: "Inventory stock adjusted successfully",
    });
  }
}
