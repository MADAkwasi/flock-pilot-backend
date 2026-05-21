import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";
import { setCookieHeaderAndSendResponse } from "../../utils/cookie.js";
import AppError from "../../utils/appError.js";
import {
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "./auth.schema.js";

export class AuthController {
  static async signUpUser(req: Request, res: Response): Promise<void> {
    const { name, password, email } = registerSchema.parse(req.body);

    const token = await authService.registerUser({ name, password, email });

    setCookieHeaderAndSendResponse(res, 201, token);
  }

  static async loginUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { email, password } = loginSchema.parse(req.body);

    const token = await authService.loginUser({ email, password });

    if (!token) return next(new AppError("Invalid Credential", 401));

    setCookieHeaderAndSendResponse(res, 200, token);
  }

  static async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { userId, body } = req;

    const token = await authService.updateUserPassword(
      userId,
      updatePasswordSchema.parse(body),
    );

    if (!token) return next(new AppError("Incorrect password", 400));

    setCookieHeaderAndSendResponse(res, 200, token);
  }

  static async getMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const user = await authService.getUser(req.userId);

    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({
      message: "success",
      data: {
        user,
      },
    });
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  }
}
