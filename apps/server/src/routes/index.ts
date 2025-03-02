import { auth } from "@server/middlewares/auth"
import { Hono } from "hono"

import { emailValidationRoute } from "./auth/emailValidation"
import { loginRoute } from "./auth/login"
import { passwordResetRoute } from "./auth/passwordReset"
import { registerRoute } from "./auth/register"
import { createHuntRoute } from "./hunts/create"
import { listHuntRoute } from "./hunts/list"
import { profileRoute } from "./users/profile"

const DEFAULT_PATH = "/" as const

const authRoutes = new Hono()
  .route(DEFAULT_PATH, registerRoute)
  .route(DEFAULT_PATH, emailValidationRoute)
  .route(DEFAULT_PATH, loginRoute)
  .route(DEFAULT_PATH, passwordResetRoute)

const huntsRoutes = new Hono()
  .use(auth)
  .route(DEFAULT_PATH, createHuntRoute)
  .route(DEFAULT_PATH, listHuntRoute)

const usersRoutes = new Hono().use(auth).route(DEFAULT_PATH, profileRoute)

export const routes = {
  auth: authRoutes,
  hunts: huntsRoutes,
  users: usersRoutes,
}
