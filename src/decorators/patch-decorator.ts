import 'reflect-metadata';
import { ControllersMetadata } from '@utils';
import { RouteMetadata } from '@types';
import { METHOD } from '@enums';

export function PATCH(path: string) {
  return function (target: object, propertyKey: string) {
    const route: RouteMetadata = {
      method: METHOD.PATCH,
      path,
      handlerName: propertyKey 
    }
    ControllersMetadata.addRoute(target, route);
  }
}
