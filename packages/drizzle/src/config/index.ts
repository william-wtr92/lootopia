import { config } from "dotenv"
import { z } from "zod"

config()

const appConfigSchema = z
  .object({
    env: z.string(),
    db: z.object({
      host: z.string(),
      user: z.string(),
      password: z.string(),
      port: z.number(),
      name: z.string(),
      migrations: z.object({
        schema: z.string(),
        out: z.string(),
        dialect: z.literal("postgresql"),
      }),
    }),
  })
  .strict()

const appConfig = appConfigSchema.parse({
  env: process.env.NODE_ENV!,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!, 10),
    name: process.env.DB_NAME,
    migrations: {
      schema: "./src/db/schema/index.ts",
      out: "./migrations",
      dialect: "postgresql",
    },
  },
})

export default appConfig
