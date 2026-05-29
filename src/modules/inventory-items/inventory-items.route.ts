import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../middleware/validator.middleware.js";
import { farmParamSchema } from "../farm/farm.scheme.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { InventoryItemController } from "./inventory-items.controller.js";
import {
  adjustInventoryItemSchema,
  clearInventoryItemSchema,
  createInventoryItemSchema,
  inventoryItemParamSchema,
  updateInventoryItemSchema,
} from "./inventory-items.schema.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:farmId")
  .get(
    validateParams(farmParamSchema),
    catchAsync(InventoryItemController.getInventories),
  )
  .post(
    validateParams(farmParamSchema),
    validateBody(createInventoryItemSchema),
    catchAsync(InventoryItemController.createInventoryItem),
  );

router
  .route("/:farmId/item/:inventoryItemId")
  .get(
    validateParams(inventoryItemParamSchema),
    catchAsync(InventoryItemController.getInventoryItem),
  )
  .delete(
    validateParams(inventoryItemParamSchema),
    catchAsync(InventoryItemController.deleteInventoryItem),
  )
  .patch(
    validateParams(inventoryItemParamSchema),
    validateBody(updateInventoryItemSchema),
    catchAsync(InventoryItemController.updateInventoryItem),
  );

router
  .route("/:farmId/item/:inventoryItemId/adjust-stock")
  .post(
    validateParams(inventoryItemParamSchema),
    validateBody(adjustInventoryItemSchema),
    catchAsync(InventoryItemController.adjustInventoryStock),
  );

router
  .route("/:farmId/item/:inventoryItemId/clear-stock")
  .post(
    validateParams(inventoryItemParamSchema),
    validateBody(clearInventoryItemSchema),
    catchAsync(InventoryItemController.clearInventoryStock),
  );

export default router;
