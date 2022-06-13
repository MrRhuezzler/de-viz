import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

const validationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validateRequest = (validations: ValidationChain[]) => {
  return [...validations, validationMiddleware];
};
