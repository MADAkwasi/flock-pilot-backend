import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import AppError from "./appError.js";
import jwt from "jsonwebtoken";

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let status = "error";
  let message = "Something went wrong!";

  // ZOD
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "fail",
      message: "Validation error",
      errors: err.issues,
    });
  }

  // CUSTOM APP ERROR
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // PRISMA ERRORS
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(400).json({
        status: "fail",
        message: "Duplicate field value violates unique constraint",
      });
    }
  }

  // JWT ERRORS
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      status: "fail",
      message: "Token expired. Please log in again.",
    });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token. Please log in again.",
    });
  }

  console.error("🔴 UNHANDLED ERROR:", err);

  return res.status(statusCode).json({
    status,
    message,
  });
};
