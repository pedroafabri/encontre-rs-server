import { NextFunction, Request, Response } from 'express';

const auth = async (req: Request, res: Response, next: NextFunction, cb: (Request, Response, NextFunction) => null) => {
  //TODO: Add cognito auth validation
  cb(req, res, next);
}

export function AUTH() {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {

    const originalValue = descriptor.value;
    descriptor.value = function(req, res, next) {
      auth(req, res, next, originalValue);
    }
  };
}
