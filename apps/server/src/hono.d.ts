/* eslint-disable @typescript-eslint/consistent-type-definitions */
import "hono"

declare module "hono" {
  interface ContextVariableMap {
    loggedUserEmail: string
  }
}
