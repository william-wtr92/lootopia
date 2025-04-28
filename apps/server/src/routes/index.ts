import { auth } from "@server/middlewares/auth"
import { isAdmin } from "@server/middlewares/isAdmin"
import { Hono } from "hono"

import { listArtifactsRoute } from "./artifacts/list"
import { uploadArtifactRoute } from "./artifacts/upload"
import { viewerRoute } from "./artifacts/viewer"
import { emailValidationRoute } from "./auth/emailValidation"
import { loginRoute } from "./auth/login"
import { passwordResetRoute } from "./auth/passwordReset"
import { registerRoute } from "./auth/register"
import { createHuntRoute } from "./hunts/create"
import { digRoute } from "./hunts/dig"
import { listHuntRoute } from "./hunts/list"
import { partipateHuntRoute } from "./hunts/participations/participate"
import { requestParticipationRoute } from "./hunts/participations/request"
import { updateHuntRoute } from "./hunts/update"
import { reportListRoute } from "./reports/list"
import { reportUploadRoute } from "./reports/upload"
import { crownPackagesRoute } from "./shop/crownPackages"
import { paymentsRoute } from "./shop/payments"
import { webhookRoute } from "./shop/webhook"
import { overviewRoute } from "./stats/overview"
import { userListRoute } from "./users/list"
import { profileRoute } from "./users/profile"
import { securityRoute } from "./users/security"

const DEFAULT_PATH = "/" as const

const authRoutes = new Hono()
  .route(DEFAULT_PATH, registerRoute)
  .route(DEFAULT_PATH, emailValidationRoute)
  .route(DEFAULT_PATH, loginRoute)
  .route(DEFAULT_PATH, passwordResetRoute)

const usersRoutes = new Hono()
  .use(auth)
  .route(DEFAULT_PATH, userListRoute)
  .route(DEFAULT_PATH, profileRoute)
  .route(DEFAULT_PATH, securityRoute)

const huntsRoutes = new Hono()
  .use(auth)
  .route(DEFAULT_PATH, createHuntRoute)
  .route(DEFAULT_PATH, listHuntRoute)
  .route(DEFAULT_PATH, updateHuntRoute)
  .route(DEFAULT_PATH, digRoute)
  .route(DEFAULT_PATH, partipateHuntRoute)
  .route(DEFAULT_PATH, requestParticipationRoute)

const artifactsRoutes = new Hono()
  .route(DEFAULT_PATH, viewerRoute)
  .use(auth)
  .route(DEFAULT_PATH, uploadArtifactRoute)
  .route(DEFAULT_PATH, listArtifactsRoute)

const reportsRoutes = new Hono()
  .use(auth)
  .route(DEFAULT_PATH, reportUploadRoute)
  .route(DEFAULT_PATH, reportListRoute)

const shopRoutes = new Hono()
  .route(DEFAULT_PATH, webhookRoute)
  .use(auth)
  .route(DEFAULT_PATH, crownPackagesRoute)
  .route(DEFAULT_PATH, paymentsRoute)

const statsRoutes = new Hono()
  .use(auth)
  .use(isAdmin)
  .route(DEFAULT_PATH, overviewRoute)

export const routes = {
  auth: authRoutes,
  hunts: huntsRoutes,
  users: usersRoutes,
  artifacts: artifactsRoutes,
  reports: reportsRoutes,
  shop: shopRoutes,
  stats: statsRoutes,
}
