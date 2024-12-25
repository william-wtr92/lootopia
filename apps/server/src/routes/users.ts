import { Hono } from "hono"

const app = new Hono()

export const usersRoutes = app.get("/test", (c) => {
  return c.json({ message: "Hello, World!", id: "1" }, 200)
})
