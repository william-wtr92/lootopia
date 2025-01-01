import type { AppType } from "@lootopia/server/src"
import { hc } from "hono/client"

import { env } from "@client/env"

export const client = hc<AppType>(env.NEXT_PUBLIC_API_URL)
