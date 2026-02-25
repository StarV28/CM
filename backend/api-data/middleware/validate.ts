import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body.data);
      next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(200).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
