import 'reflect-metadata';
import { ControllersMetadata } from '@utils';
import { RouteMetadata } from '@types';
import { METHOD } from '@enums';

export function DELETE(path: string) {
  return function (target: object, propertyKey: string) {
    const route: RouteMetadata = {
      method: METHOD.DELETE,
      path,
      handlerName: propertyKey 
    }
    ControllersMetadata.addRoute(target, route)
  }
}
