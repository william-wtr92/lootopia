import { oneDay } from "@server/utils/helpers/times"
import { config } from "dotenv"
import { env } from "process"
import { z } from "zod"

config()

const appConfigSchema = z
  .object({
    env: z.string(),
    port: z.number(),
    db: z.object({
      host: z.string(),
      user: z.string(),
      password: z.string(),
      port: z.number(),
      name: z.string(),
    }),
    security: z.object({
      jwt: z.object({
        secret: z.string(),
        expiresIn: z.number(),
        algorithm: z.literal("HS512"),
      }),
      cors: z.object({
        origin: z.string(),
        methods: z.array(z.string()),
        headers: z.array(z.string()),
        credentials: z.boolean(),
      }),
      password: z.object({
        saltlen: z.number(),
        keylen: z.number(),
        iterations: z.number(),
        digest: z.string(),
        pepper: z.string(),
      }),
      cookie: z.object({
        secret: z.string(),
        maxAge: z.number(),
      }),
    }),
    redis: z.object({
      host: z.string(),
      port: z.string(),
      username: z.string(),
      password: z.string(),
      db: z.string(),
    }),
    azure: z.object({
      blob: z.object({
        connection: z.string(),
        container: z.string(),
      }),
    }),
    sendgrid: z.object({
      key: z.string(),
      baseUrl: z.string(),
      sender: z.string(),
      template: z.object({
        register: z.string(),
        emailChangeValidation: z.string(),
        passwordReset: z.string(),
      }),
    }),
  })
  .strict()

const appConfig = appConfigSchema.parse({
  env: env.NODE_ENV!,
  port: parseInt(process.env.SERVER_PORT!, 10),
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!, 10),
    name: process.env.DB_NAME,
  },
  security: {
    jwt: {
      secret: process.env.SECURITY_JWT_SECRET,
      expiresIn: oneDay,
      algorithm: "HS512",
    },
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE"],
      headers: ["Content-Type", "Authorization"],
      credentials: true,
    },
    password: {
      saltlen: 512,
      keylen: 512,
      iterations: 10000,
      digest: "sha512",
      pepper: process.env.SECURITY_PASSWORD_PEPPER,
    },
    cookie: {
      secret: process.env.SECURITY_COOKIE_SECRET,
      maxAge: 86400,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
  azure: {
    blob: {
      connection: process.env.AZURE_BLOB_CONNECTION,
      container: process.env.AZURE_BLOB_CONTAINER,
    },
  },
  sendgrid: {
    key: process.env.SENDGRID_KEY,
    baseUrl: process.env.SENDGRID_BASE_URL,
    sender: process.env.SENDGRID_SENDER,
    template: {
      register: process.env.SENDGRID_TEMPLATE_REGISTER,
      emailChangeValidation:
        process.env.SENDGRID_TEMPLATE_EMAIL_CHANGE_VALIDATION,
      passwordReset: process.env.SENDGRID_TEMPLATE_PASSWORD_RESET,
    },
  },
})

export default appConfig
