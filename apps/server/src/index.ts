import { serve } from "@hono/node-server"
import { Hono } from "hono"

const app = new Hono()

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRouter = app.get("/", (c) => {
  return c.text("Hello Hono!")
})

const port = 3001
//eslint-disable-next-line no-console
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})

export type AppType = typeof appRouter
