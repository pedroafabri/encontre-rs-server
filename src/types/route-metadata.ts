import { METHOD } from "../enum"

export type RouteMetadata = {
  method: METHOD,
  path: string,
  handlerName: string
}