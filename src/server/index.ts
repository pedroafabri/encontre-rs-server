import cors from 'cors';
import { CONTROLLERS } from '@controllers';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { RouteMetadata } from '@types';
import { ControllersMetadata } from '@utils';
import { METHOD } from '@enums';
import { errorHandlerMiddleware } from '@middlewares';

export default class Server {

  static app: express.Application;

  public static listen(port: number) {
    this.app = express();
    this.initialize();
    this.app.listen(port, () => console.log(`Server listening on internal PORT ${port}`));
  }

  private static initialize() {
    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandlers();
  }

  private static initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private static initializeControllers() {
    CONTROLLERS.forEach(controller => {
      const routes: Array<RouteMetadata> = ControllersMetadata.getRoutes(controller.prototype);

      routes.forEach(route => {
        const instance:unknown = new controller();
        const endpoint:unknown = instance[route.handlerName].bind(instance);
        const method:unknown = METHOD[route.method].toLowerCase();
        this.app[method as keyof Application](route.path, endpoint);
      });
    });
  }

  private static initializeErrorHandlers() {
    this.app.use(errorHandlerMiddleware);
  }
}
