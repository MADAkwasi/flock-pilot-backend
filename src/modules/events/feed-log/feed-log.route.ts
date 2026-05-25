import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../../middleware/validator.middleware.js";
import {
  createFeedLogSchema,
  feedLogParamsSchema,
  updateFeedLogSchema,
} from "./feed-log.schema.js";
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
  .route("/:flockId/feed-log/:feedLogId")
  .get(
    validateParams(feedLogParamsSchema),
    catchAsync(FeedLogController.getFeedLog),
  )
  .patch(
    validateParams(feedLogParamsSchema),
    validateBody(updateFeedLogSchema),
    catchAsync(FeedLogController.updateFeedLog),
  )
  .delete(
    validateParams(feedLogParamsSchema),
    catchAsync(FeedLogController.deleteFeedLog),
  );

export default router;
