import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateBody } from "../../middleware/validator.middleware.js";
import {
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "./auth.schema.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { protect } from "../../middleware/auth.middleware.js";

const router: Router = Router();

router
  .route("/signup")
  .post(validateBody(registerSchema), catchAsync(AuthController.signUpUser));

router
  .route("/login")
  .post(validateBody(loginSchema), catchAsync(AuthController.loginUser));

router.route("/logout").post(catchAsync(AuthController.logout));

router
  .route("/update-password")
  .post(
    protect,
    validateBody(updatePasswordSchema),
    catchAsync(AuthController.updatePassword),
  );

router.route("/me").get(protect, catchAsync(AuthController.getMe));

export default router;
