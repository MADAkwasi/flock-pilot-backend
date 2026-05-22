import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import { validateParams } from "../../../middleware/validator.middleware.js";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { HealthController } from "./health.controller.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:flockId")
  .get(
    validateParams(flockParamsSchema),
    catchAsync(HealthController.getHealthRecords),
  );

export default router;
