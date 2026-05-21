import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { validateBody } from "../../middleware/validator.middleware.js";
import { createFarmSchema } from "./farm.scheme.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { FarmController } from "./farm.controller.js";

const router: Router = Router();

router.use(protect);

router
  .route("/")
  .post(validateBody(createFarmSchema), catchAsync(FarmController.createFarm));

export default router;
