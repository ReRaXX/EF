import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ValidationError } from "../errors/app-error";

export function validateBody(DtoClass: any) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      return next(new ValidationError(messages));
    }

    req.body = dto;
    next();
  };
}
