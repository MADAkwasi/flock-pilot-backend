import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../middleware/validator.middleware.js";
import { farmParamSchema } from "../farm/farm.scheme.js";
import { askAssistantSchema } from "./ai-assistant.schema.js";
import { catchAsync } from "../../utils/catchAsync.js";
import AiAssistantController from "./ai-assistant.controller.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:farmId/ask")
  .post(
    validateParams(farmParamSchema),
    validateBody(askAssistantSchema),
    catchAsync(AiAssistantController.askAssistant),
  );

export default router;
