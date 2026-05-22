import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../../middleware/validator.middleware.js";
import { createFeedLogSchema, feedLogParamsSchema } from "./feed-log.schema.js";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { FeedLogController } from "./feed-log.controller.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:flockId")
  .get(
    validateParams(flockParamsSchema),
    catchAsync(FeedLogController.getFeedLogs),
  )
  .post(
    validateParams(flockParamsSchema),
    validateBody(createFeedLogSchema),
    catchAsync(FeedLogController.createFeedLog),
  );

router
  .route("/:flockId/:feedLogId")
  .get(
    validateParams(feedLogParamsSchema),
    catchAsync(FeedLogController.getFeedLog),
  );

export default router;
