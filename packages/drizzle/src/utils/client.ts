import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import appConfig from "@drizzle/config"
import * as schema from "@drizzle/db/schema"

const {
  env,
  db: { host, user, password, port, name },
} = appConfig

export const client = postgres(
  `postgresql://${user}:${password}@${host}:${port}/${name}`
)

export const db = drizzle({
  client,
  schema,
  logger: env === "development" ? true : false,
})
