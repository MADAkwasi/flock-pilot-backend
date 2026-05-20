import type { NextFunction, Request, Response } from "express";
import { userService } from "./auth.service.js";
import { setCookieHeaderAndSendResponse } from "../../utils/cookie.js";
import AppError from "../../utils/appError.js";

export class UserController {
  static async signUpUser(req: Request, res: Response): Promise<void> {
    const { name, password, email } = req.body;

    const token = await userService.registerUser({ name, password, email });

    setCookieHeaderAndSendResponse(res, 201, token);
  }

  static async loginUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { email, password } = req.body;

    const token = await userService.loginUser({ email, password });

    if (!token) return next(new AppError("Invalid Credential", 401));

    setCookieHeaderAndSendResponse(res, 200, token);
  }
}
