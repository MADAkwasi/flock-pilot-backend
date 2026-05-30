import { Router } from "express";
import { validateParams } from "../../middleware/validator.middleware.js";
import { farmParamSchema } from "../farm/farm.scheme.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AnalyticsController } from "./analytics.controller.js";

const router: Router = Router();

router
  .route("/:farmId/overview")
  .get(
    validateParams(farmParamSchema),
    catchAsync(AnalyticsController.getFarmOverview),
  );

router
  .route("/:farmId/trends")
  .get(
    validateParams(farmParamSchema),
    catchAsync(AnalyticsController.getTrends),
  );

router
  .route("/:farmId/insights")
  .get(
    validateParams(farmParamSchema),
    catchAsync(AnalyticsController.getInsights),
  );

router
  .route("/:farmId/predictions")
  .get(
    validateParams(farmParamSchema),
    catchAsync(AnalyticsController.getPredictions),
  );

export default router;
