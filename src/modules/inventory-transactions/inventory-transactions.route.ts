import { Router } from "express";
import { validateParams } from "../../middleware/validator.middleware.js";
import { farmParamSchema } from "../farm/farm.scheme.js";
import { catchAsync } from "../../utils/catchAsync.js";
import InventoryTransactionController from "./inventory-transactions.controller.js";
import { inventoryItemParamSchema } from "../inventory-items/inventory-items.schema.js";
import { flockParamsSchema } from "../flock/flock.schema.js";
import { transactionParamSchema } from "./inventory-transactions.schema.js";
import { protect } from "../../middleware/auth.middleware.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:farmId")
  .get(
    validateParams(farmParamSchema),
    catchAsync(InventoryTransactionController.getFarmInventoryTransactions),
  );

router
  .route("/:farmId/item/:inventoryItemId")
  .get(
    validateParams(inventoryItemParamSchema),
    catchAsync(InventoryTransactionController.getInventoryItemTransactions),
  );

router
  .route("/:farmId/flock/:flockId")
  .get(
    validateParams(farmParamSchema),
    validateParams(flockParamsSchema),
    catchAsync(InventoryTransactionController.getFlockInventoryTransactions),
  );

router
  .route("/:farmId/transaction/:transactionId")
  .get(
    validateParams(transactionParamSchema),
    catchAsync(InventoryTransactionController.getInventoryTransactionById),
  );

export default router;
