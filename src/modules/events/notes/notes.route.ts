import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../../middleware/validator.middleware.js";
import { flockParamsSchema } from "../../flock/flock.schema.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { NoteController } from "./notes.controller.js";
import { noteSchema, notesParamSchema } from "./notes.schema.js";

const router: Router = Router();

router.use(protect);

router
  .route("/:flockId")
  .get(validateParams(flockParamsSchema), catchAsync(NoteController.getNotes))
  .post(
    validateParams(flockParamsSchema),
    validateBody(noteSchema),
    catchAsync(NoteController.createNote),
  );

router
  .route("/:flockId/note/:noteId")
  .get(validateParams(notesParamSchema), catchAsync(NoteController.getNote))
  .patch(
    validateParams(notesParamSchema),
    validateBody(noteSchema),
    catchAsync(NoteController.updateNote),
  )
  .delete(
    validateParams(notesParamSchema),
    catchAsync(NoteController.deleteNote),
  );

export default router;
