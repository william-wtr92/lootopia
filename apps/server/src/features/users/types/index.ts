import type { users } from "@lootopia/drizzle"

export type DecodedToken = {
  payload: {
    user: {
      id: string
      email: string
      name: string
    }
  }
}

export type SelectUser = typeof users.$inferSelect
