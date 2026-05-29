import type { Request, Response } from "express";
import { inventoryTransactionService } from "./inventory-transactions.service.js";
import { farmParamSchema } from "../farm/farm.scheme.js";
import { inventoryItemParamSchema } from "../inventory-items/inventory-items.schema.js";
import { flockParamsSchema } from "../flock/flock.schema.js";
import { transactionParamSchema } from "./inventory-transactions.schema.js";

class InventoryTransactionController {
  public static async getFarmInventoryTransactions(
    req: Request,
    res: Response,
  ) {
    const { userId } = req;
    const { farmId } = farmParamSchema.parse(req.params);

    const transactions =
      await inventoryTransactionService.getFarmInventoryTransactions(
        farmId,
        userId,
      );

    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  }

  public static async getInventoryItemTransactions(
    req: Request,
    res: Response,
  ) {
    const { farmId, inventoryItemId } = inventoryItemParamSchema.parse(
      req.params,
    );
    const { userId } = req;

    const transactions =
      await inventoryTransactionService.getInventoryItemTransactions(
        farmId,
        userId,
        inventoryItemId,
      );

    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  }

  public static async getInventoryTransactionById(req: Request, res: Response) {
    const { farmId, transactionId } = transactionParamSchema.parse(req.params);
    const { userId } = req;

    const transaction =
      await inventoryTransactionService.getInventoryTransactionById(
        farmId,
        userId,
        transactionId,
      );

    res.status(200).json({
      status: "success",
      data: transaction,
    });
  }

  public static async getFlockInventoryTransactions(
    req: Request,
    res: Response,
  ) {
    const { flockId } = flockParamsSchema.parse(req.params);
    const { farmId } = farmParamSchema.parse(req.params);
    const { userId } = req;

    const transactions =
      await inventoryTransactionService.getFlockInventoryTransactions(
        farmId,
        userId,
        flockId,
      );

    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  }
}

export default InventoryTransactionController;
