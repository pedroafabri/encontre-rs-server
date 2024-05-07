import { NextFunction, Request, Response } from 'express';
import {UnauthorizedError} from "@errors";
import {JWT} from "@utils";
import {UserRepository} from "../repositories";

const auth = async (req: Request, res: Response, next: NextFunction, cb: (Request, Response, NextFunction) => null) => {
  const token = req.headers.authorization;
  if(!token) {
    return next(new UnauthorizedError('No Token provided'));
  }

  if(!JWT.Verify(token)) {
    return next(new UnauthorizedError('Invalid Token provided'));
  }

  const decoded = JWT.Decode(token);
  const user = await UserRepository.findOne({ _id: decoded.id });
  if(!user) {
    return next(new UnauthorizedError('Invalid Token provided'));
  }

  req['user'] = user;

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
