import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if the schema expects a nested body structure
      if (zodSchema.shape && zodSchema.shape.body) {
        // If schema expects {body: {...}}, but request has direct JSON
        // Wrap the request body in a body property
        await zodSchema.parseAsync({ body: req.body });
      } else {
        // For schemas that don't expect a nested body
        await zodSchema.parseAsync(req.body);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
