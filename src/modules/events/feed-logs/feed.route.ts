import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../../middleware/validator.middleware.js";
import { createFeedLogSchema } from "./feed.schema.js";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { FeedLogController } from "./feed.controller.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:flockId")
  .post(
    validateParams(flockParamsSchema),
    validateBody(createFeedLogSchema),
    catchAsync(FeedLogController.createFeedLog),
  );

export default router;
