import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "../../middleware/validator.middleware.js";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  createFlockSchema,
  flockParamsSchema,
  updateFlockSchema,
  updateFlockStatusSchema,
} from "./flock.schema.js";
import { FlockController } from "./flock.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router: Router = Router();

router.use(protect);

router
  .route("/")
  .get(catchAsync(FlockController.getFarmFlocks))
  .post(
    validateBody(createFlockSchema),
    catchAsync(FlockController.createFlock),
  );

router
  .route("/:flockId")
  .get(validateParams(flockParamsSchema), catchAsync(FlockController.getFlock))
  .patch(
    validateBody(updateFlockSchema),
    validateParams(flockParamsSchema),
    catchAsync(FlockController.updateFlock),
  );

router
  .route("/:flockId/status")
  .patch(
    validateParams(flockParamsSchema),
    validateBody(updateFlockStatusSchema),
    catchAsync(FlockController.updateStatus),
  );

export default router;
