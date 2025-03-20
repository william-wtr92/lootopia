import { serve } from "@hono/node-server"
import { SC } from "@lootopia/common"
import appConfig from "@server/config"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { etag } from "hono/etag"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { secureHeaders } from "hono/secure-headers"
import cron from "node-cron"

import { routeNotFound, unspecifiedErrorOccurred } from "./features/global"
import { deleteInactiveUsersJob } from "./jobs/deleteInactiveUsers"
import { routes } from "./routes"
import { router } from "./utils/router"

const app = new Hono()

app.use(
  "*",
  cors({
    origin: appConfig.security.cors.origin,
    allowMethods: appConfig.security.cors.methods,
    allowHeaders: appConfig.security.cors.headers,
    credentials: appConfig.security.cors.credentials,
  }),
  secureHeaders(),
  etag(),
  logger(),
  prettyJSON()
)

/** Route Not Found Handler **/
app.notFound((c) => {
  return c.json(routeNotFound, SC.errors.NOT_FOUND)
})

/** Global Error Handler **/
app.onError((_, c) => {
  return c.json(unspecifiedErrorOccurred, SC.serverErrors.INTERNAL_SERVER_ERROR)
})

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRouter = app
  .route(router.auth, routes.auth)
  .route(router.hunts, routes.hunts)
  .route(router.users, routes.users)
  .route(router.artifacts, routes.artifacts)

serve({
  fetch: app.fetch,
  port: appConfig.port,
})

// Delete inactive users every day at midnight
cron.schedule("0 0 * * *", async () => {
  await deleteInactiveUsersJob()
})

//eslint-disable-next-line no-console
console.info(`🚀 Server running on port ${appConfig.port}`)

export type AppType = typeof appRouter
