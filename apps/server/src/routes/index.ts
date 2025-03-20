import { auth } from "@server/middlewares/auth"
import { Hono } from "hono"

import { listArtifactsRoute } from "./artifacts/list"
import { uploadArtifactRoute } from "./artifacts/upload"
import { emailValidationRoute } from "./auth/emailValidation"
import { loginRoute } from "./auth/login"
import { passwordResetRoute } from "./auth/passwordReset"
import { reactivateAccountRoute } from "./auth/reactivateAccount"
import { registerRoute } from "./auth/register"
import { createHuntRoute } from "./hunts/create"
import { listHuntRoute } from "./hunts/list"
import { deactivateAccountRoute } from "./users/deactivateAccount"
import { profileRoute } from "./users/profile"

const DEFAULT_PATH = "/" as const

const authRoutes = new Hono()
  .route(DEFAULT_PATH, registerRoute)
  .route(DEFAULT_PATH, emailValidationRoute)
  .route(DEFAULT_PATH, loginRoute)
  .route(DEFAULT_PATH, passwordResetRoute)
  .route(DEFAULT_PATH, reactivateAccountRoute)

const usersRoutes = new Hono()
  .use(auth)
  .route(DEFAULT_PATH, profileRoute)
  .route(DEFAULT_PATH, deactivateAccountRoute)

const huntsRoutes = new Hono()
  .use(auth)
  .route(DEFAULT_PATH, createHuntRoute)
  .route(DEFAULT_PATH, listHuntRoute)

const artifactsRoutes = new Hono()
  .use(auth)
  .route(DEFAULT_PATH, uploadArtifactRoute)
  .route(DEFAULT_PATH, listArtifactsRoute)

export const routes = {
  auth: authRoutes,
  hunts: huntsRoutes,
  users: usersRoutes,
  artifacts: artifactsRoutes,
}
