import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import AppError from "../../utils/appError.js";

export class AuthController {
  static async signUpUser(req: Request, res: Response): Promise<void> {
    const { name, password, email } = req.body;

    const { token, user } = await authService.registerUser({
      name,
      password,
      email,
    });

    res.status(201).json({
      token,
      user,
    });
  }

  static async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const { token, user } = await authService.loginUser({ email, password });

    res.status(200).json({
      token,
      user,
    });
  }

  static async updatePassword(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;

    const token = await authService.updateUserPassword(userId, body);

    res.status(200).json({
      status: "success",
      token,
    });
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    const user = await authService.getUser(req.userId);

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  }
}
