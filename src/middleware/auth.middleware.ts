import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import AppError from "../utils/appError.js";
import { prisma } from "../db/prisma.js";

export const protect = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError("Please log in to have access to the resource", 401),
    );
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(
        new AppError("User no longer exists. Please log in again.", 401),
      );
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    next(error);
  }
};
