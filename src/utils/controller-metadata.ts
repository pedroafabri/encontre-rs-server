import { RouteMetadata } from "@types";
const METADATA_KEY = 'routes';

export class ControllersMetadata {
  
  /**
   * Adds a route on Class metadata
   * @param target Class to add metadata to (normally from Decorator's target)
   * @param route RouteMetadata information
   */
  public static addRoute(target: object, route: RouteMetadata) {
    const routes = this.getRoutes(target);
    routes.push(route);
    Reflect.defineMetadata(METADATA_KEY, routes, target);
  }

  /**
   * Gets all routes registered on a controller
   * @param target Prototype of controller class
   * @returns Array<RouteMetadata> defined on class metadata
   */
  public static getRoutes(target: object) : Array<RouteMetadata> {
    const routes = Reflect.getMetadata(METADATA_KEY, target) || [];
    return routes;
  }

}
