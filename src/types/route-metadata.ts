import { METHOD } from "@enums"

export type RouteMetadata = {
  method: METHOD,
  path: string,
  handlerName: string
}
