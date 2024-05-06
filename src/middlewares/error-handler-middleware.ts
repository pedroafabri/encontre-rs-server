import { ServerError } from '@errors';
import { NextFunction, Request, Response } from 'express';

interface ErrorMessage {
  error: string,
  message?: string
}

export function errorHandlerMiddleware(err: ServerError, req: Request, res: Response, next: NextFunction) {
  if(res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500);
  const returnObject: ErrorMessage = {
    error: err.name
  }

  if(err.message) { returnObject.message = err.message; }
  console.error(err);
  res.send(returnObject);
}
