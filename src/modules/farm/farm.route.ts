import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../middleware/validator.middleware.js";
import {
  createFarmSchema,
  updateFarmBodySchema,
  farmParamSchema,
} from "./farm.scheme.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { FarmController } from "./farm.controller.js";

const router: Router = Router();

router.use(protect);

router
  .route("/")
  .post(validateBody(createFarmSchema), catchAsync(FarmController.createFarm));

router.route("/my-farms").get(catchAsync(FarmController.getMyFarms));

router
  .route("/:farmId")
  .get(validateParams(farmParamSchema), catchAsync(FarmController.getFarm))
  .patch(
    validateParams(farmParamSchema),
    validateBody(updateFarmBodySchema),
    catchAsync(FarmController.updateFarm),
  );

router.get(
  "/:farmId/dashboard",
  validateParams(farmParamSchema),
  catchAsync(FarmController.getFarmDashboard),
);

router
  .route("/:farmId/deactivate")
  .patch(
    validateParams(farmParamSchema),
    catchAsync(FarmController.deactivate),
  );

router
  .route("/:farmId/activate")
  .patch(validateParams(farmParamSchema), catchAsync(FarmController.activate));

export default router;
