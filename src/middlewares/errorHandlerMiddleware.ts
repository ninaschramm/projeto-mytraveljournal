import { NextFunction, Request, Response } from 'express';
import { AppError } from '../types/errorTypes';
import {  errorTypeToStatusCode, isAppError } from '../utils/errorUtils';

export function errorHandlerMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (isAppError(err)) {
    return res.status(errorTypeToStatusCode(err.type)).send(err);
  }

  return res.sendStatus(500);
}
