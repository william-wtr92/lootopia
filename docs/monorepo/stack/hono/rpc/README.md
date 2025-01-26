# 🔍 RPC

> The RPC feature allows sharing of the API specifications between the server and the client. You can export the types of input type specified by the Validator and the output type emitted by json(). And Hono Client will be able to import it.

## 📚 Resources

- [📝 Hono RPC](https://hono.dev/docs/guides/rpc)

## 🔨 Usage

- Make sure your routes are defined like this:

```ts
import { zValidator } from "@hono/zod-validator"
import { registerSchema } from "@lootopia/common"
import { hashPassword } from "@server/utils/helpers/password"
import { Hono } from "hono"

const app = new Hono()

export const authRoutes = app.post(
  "/register",
  zValidator("json", registerSchema),
  async (c) => {
    const body = c.req.valid("json")
    const { password, confirmPassword, ...filteredBody } = body
     
    ....

    const [passwordHash, passwordSalt] = await hashPassword(password)

    await insertUser(filteredBody, avatarUrl as string, [
      passwordHash,
      passwordSalt,
    ])

    return c.json(registerSuccess, SC.success.CREATED)
  }
)
```

- Export the type from `index.ts` to the root of your `src`:

```ts

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

...

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRouter = app.route(router.auth, routes.auth)

serve({
  fetch: app.fetch,
  port: appConfig.port,
})

//eslint-disable-next-line no-console
console.info(`🚀 Server running on port ${appConfig.port}`)

export type AppType = typeof appRouter // Export the type for further use
```

- Import the type in your client:

```bash
cd apps/client && pnpm add hono
```

```ts
import type { AppType } from "@lootopia/server/src" // Import the type from the server
import { hc } from "hono/client" // Import the Hono Client 

import { env } from "@client/env"

export const client = hc<AppType>(env.NEXT_PUBLIC_API_URL)
```

- Use the client in your application:

```ts
"use client"

import type { RegisterSchema } from "@lootopia/common"
import type { ParsedFormValue } from "hono/types"

import { client } from "@client/web/utils/client"

export const register = async (data: RegisterSchema) => {
  const response = await client.auth.register.$post({
    json: data,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
```