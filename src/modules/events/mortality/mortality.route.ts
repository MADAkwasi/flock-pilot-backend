import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../../middleware/validator.middleware.js";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { MortalityController } from "./mortality.controller.js";
import {
  createMortalityRecordSchema,
  mortalityRecordParamSchema,
  updateMortalityRecordSchema,
} from "./mortality.schema.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:flockId")
  .get(
    validateParams(flockParamsSchema),
    catchAsync(MortalityController.getMortalityRecords),
  )
  .post(
    validateParams(flockParamsSchema),
    validateBody(createMortalityRecordSchema),
    catchAsync(MortalityController.createMortalityRecord),
  );

router
  .route("/:flockId/record/:mortalityRecordId")
  .get(
    validateParams(mortalityRecordParamSchema),
    catchAsync(MortalityController.getMortalityRecord),
  )
  .patch(
    validateParams(mortalityRecordParamSchema),
    validateBody(updateMortalityRecordSchema),
    catchAsync(MortalityController.updateMortalityRecord),
  );

export default router;
