import type { Request, Response, NextFunction } from "express";
import type { ZodSchema, ZodTypeAny } from "zod";

export const validateBody =
  (schema: ZodSchema) => (req: Request, _: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (err) {
      next(err);
    }
  };

export const validateParams =
  <T extends ZodTypeAny>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.params = schema.parse(req.params);

      next();
    } catch (err) {
      next(err);
    }
  };
