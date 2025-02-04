import { Hono } from "hono"

import { emailValidationRoute } from "./auth/emailValidation"
import { registerRoute } from "./auth/register"

const DEFAULT_PATH = "/" as const

const authRoutes = new Hono()
  .route(DEFAULT_PATH, registerRoute)
  .route(DEFAULT_PATH, emailValidationRoute)

export const routes = {
  auth: authRoutes,
}
