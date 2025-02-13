import { usersRoutes } from "@server/routes/users"
import { Hono } from "hono"

import { emailValidationRoute } from "./auth/emailValidation"
import { loginRoute } from "./auth/login"
import { registerRoute } from "./auth/register"

const DEFAULT_PATH = "/" as const

const authRoutes = new Hono()
  .route(DEFAULT_PATH, registerRoute)
  .route(DEFAULT_PATH, emailValidationRoute)
  .route(DEFAULT_PATH, loginRoute)

export const routes = {
  auth: authRoutes,
  users: usersRoutes,
}
