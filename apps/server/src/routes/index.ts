import { auth } from "@server/middlewares/auth"
import { Hono } from "hono"

import { emailValidationRoute } from "./auth/emailValidation"
import { loginRoute } from "./auth/login"
import { registerRoute } from "./auth/register"
import { createHuntRoute } from "./hunts/create"
import { profileRoute } from "./users/profile"

const DEFAULT_PATH = "/" as const

const authRoutes = new Hono()
  .route(DEFAULT_PATH, registerRoute)
  .route(DEFAULT_PATH, emailValidationRoute)
  .route(DEFAULT_PATH, loginRoute)

const huntsRoutes = new Hono().use(auth).route(DEFAULT_PATH, createHuntRoute)

const usersRoutes = new Hono().use(auth).route(DEFAULT_PATH, profileRoute)

export const routes = {
  auth: authRoutes,
  hunts: huntsRoutes,
  users: usersRoutes,
}
