import type { Response } from "express";
import { env } from "../config/env.js";

export const setCookieHeaderAndSendResponse = (
  res: Response,
  statusCode: number,
  token: string,
) => {
  res.cookie("jwt", token, {
    httpOnly: env.NODE_ENV === "production",
    // secure: true,
    // sameSite: "lax",
    sameSite: "none",
    secure: true,
  });

  res.status(statusCode).json({
    status: "success",
  });
};
