import type { AppType } from "@lootopia/server/src"
import { hc } from "hono/client"

export const client = hc<AppType>("http://localhost:3001/")
