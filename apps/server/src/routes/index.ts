import { auth } from "@server/middlewares/auth"
import { Hono } from "hono"

import { listArtifactsRoute } from "./artifacts/list"
import { uploadArtifactRoute } from "./artifacts/upload"
import { emailValidationRoute } from "./auth/emailValidation"
import { loginRoute } from "./auth/login"
import { passwordResetRoute } from "./auth/passwordReset"
import { registerRoute } from "./auth/register"
import { createHuntRoute } from "./hunts/create"
import { listHuntRoute } from "./hunts/list"
import { partipateHuntRoute } from "./hunts/participate"
import { updateHuntRoute } from "./hunts/update"
import { crownPackagesRoute } from "./shop/crownPackages"
import { paymentsRoute } from "./shop/payments"
import { webhookRoute } from "./shop/webhook"
import { profileRoute } from "./users/profile"

const DEFAULT_PATH = "/" as const

const authRoutes = new Hono()
  .route(DEFAULT_PATH, registerRoute)
  .route(DEFAULT_PATH, emailValidationRoute)
  .route(DEFAULT_PATH, loginRoute)
  .route(DEFAULT_PATH, passwordResetRoute)

const usersRoutes = new Hono().use(auth).route(DEFAULT_PATH, profileRoute)

const huntsRoutes = new Hono()
  .use(auth)
  .route(DEFAULT_PATH, createHuntRoute)
  .route(DEFAULT_PATH, listHuntRoute)
  .route(DEFAULT_PATH, partipateHuntRoute)
  .route(DEFAULT_PATH, updateHuntRoute)

const artifactsRoutes = new Hono()
  .use(auth)
  .route(DEFAULT_PATH, uploadArtifactRoute)
  .route(DEFAULT_PATH, listArtifactsRoute)

const shopRoutes = new Hono()
  .route(DEFAULT_PATH, webhookRoute)
  .use(auth)
  .route(DEFAULT_PATH, crownPackagesRoute)
  .route(DEFAULT_PATH, paymentsRoute)

export const routes = {
  auth: authRoutes,
  hunts: huntsRoutes,
  users: usersRoutes,
  artifacts: artifactsRoutes,
  shop: shopRoutes,
}
