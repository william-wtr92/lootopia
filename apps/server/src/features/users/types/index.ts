import type { users } from "@lootopia/drizzle"

export type DecodedToken = {
  payload: {
    user: {
      email: string
    }
  }
}

export type User = typeof users.$inferSelect
