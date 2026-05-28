import { Router } from "express";
import { SalesController } from "./sales.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../middleware/validator.middleware.js";
import { farmParamSchema } from "../farm/farm.scheme.js";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  createSaleSchema,
  salesParamSchema,
  updateSaleSchema,
} from "./sales.schema.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:farmId")
  .get(
    validateParams(farmParamSchema),
    catchAsync(SalesController.getSalesRecordHistory),
  )
  .post(
    validateParams(farmParamSchema),
    validateBody(createSaleSchema),
    catchAsync(SalesController.createSaleRecord),
  );

router
  .route("/:farmId/sale/:salesId")
  .get(
    validateParams(salesParamSchema),
    catchAsync(SalesController.getSaleRecord),
  )
  .patch(
    validateParams(farmParamSchema),
    validateBody(updateSaleSchema),
    catchAsync(SalesController.updateSaleRecord),
  )
  .delete(
    validateParams(farmParamSchema),
    catchAsync(SalesController.deleteSaleRecord),
  );

export default router;
