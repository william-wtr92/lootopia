import * as schema from "@lootopia/drizzle"
import appConfig from "@server/config"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const {
  env,
  db: { host, user, password, port, name },
} = appConfig

const client = postgres(
  `postgresql://${user}:${password}@${host}:${port}/${name}`
)

export const db = drizzle({
  client,
  schema,
  logger: env === "development" ? true : false,
})
