import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../../middleware/validator.middleware.js";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { HealthController } from "./health.controller.js";
import {
  createHealthRecordSchema,
  healthRecordParamSchema,
} from "./health.schema.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:flockId")
  .get(
    validateParams(flockParamsSchema),
    catchAsync(HealthController.getHealthRecords),
  )
  .post(
    validateBody(createHealthRecordSchema),
    validateParams(flockParamsSchema),
    catchAsync(HealthController.createHealthRecord),
  );

router
  .route("/:flockId/:healthRecordId")
  .get(
    validateParams(healthRecordParamSchema),
    catchAsync(HealthController.getHealthRecord),
  );

export default router;
