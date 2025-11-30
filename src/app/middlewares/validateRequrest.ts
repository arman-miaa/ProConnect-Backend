import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const validateRequest =
  (zodSchema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role) {
        req.body.role = req.user.role;
      }

      req.body = await zodSchema.parseAsync(req.body);
    

      next();
    } catch (err) {
      next(err);
    }
  };
