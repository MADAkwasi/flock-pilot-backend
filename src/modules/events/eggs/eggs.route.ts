import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../../middleware/validator.middleware.js";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import {
  createEggProductionSchema,
  eggProductionParamSchema,
} from "./eggs.schema.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { EggProductionController } from "./eggs.controller.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:flockId")
  .post(
    validateParams(flockParamsSchema),
    validateBody(createEggProductionSchema),
    catchAsync(EggProductionController.recordEggProduction),
  )
  .get(
    validateParams(flockParamsSchema),
    catchAsync(EggProductionController.getEggProductionHistory),
  );

router
  .route("/:flockId/production/:productionId")
  .get(
    validateParams(eggProductionParamSchema),
    catchAsync(EggProductionController.getEggProduction),
  );

export default router;
