import { serve } from "@hono/node-server"
import appConfig from "@server/config"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { etag } from "hono/etag"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { secureHeaders } from "hono/secure-headers"

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
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRouter = app.route(router.users, routes.users)

serve({
  fetch: app.fetch,
  port: appConfig.port,
})

//eslint-disable-next-line no-console
console.info(`🚀 Server running on port ${appConfig.port}`)

export type AppType = typeof appRouter
