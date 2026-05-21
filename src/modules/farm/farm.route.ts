import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../middleware/validator.middleware.js";
import {
  createFarmSchema,
  updateFarmBodySchema,
  updateFarmParamsSchema,
} from "./farm.scheme.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { FarmController } from "./farm.controller.js";

const router: Router = Router();

router.use(protect);

router
  .route("/")
  .post(validateBody(createFarmSchema), catchAsync(FarmController.createFarm));

router.route("/my-farms").get(FarmController.getMyFarms);

router
  .route("/:farmId")
  .get(
    validateParams(updateFarmParamsSchema),
    catchAsync(FarmController.getFarm),
  )
  .patch(
    validateParams(updateFarmParamsSchema),
    validateBody(updateFarmBodySchema),
    catchAsync(FarmController.updateFarm),
  );

router
  .route("/:farmId/deactivate")
  .patch(
    validateParams(updateFarmParamsSchema),
    catchAsync(FarmController.deactivate),
  );

router
  .route("/:farmId/activate")
  .patch(
    validateParams(updateFarmParamsSchema),
    catchAsync(FarmController.activate),
  );

export default router;
