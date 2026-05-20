import { Router } from "express";
import { UserController } from "./auth.controller.js";
import { validateBody } from "../../middleware/validator.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { catchAsync } from "../../utils/catchAsync.js";

const router: Router = Router();

router
  .route("/signup")
  .post(validateBody(registerSchema), catchAsync(UserController.signUpUser));

router
  .route("/login")
  .post(validateBody(loginSchema), catchAsync(UserController.loginUser));

export default router;
