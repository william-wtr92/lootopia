import type { users } from "@lootopia/drizzle"

export type DecodedToken = {
  payload: {
    user: {
      email: string
      newEmail?: string
    }
  }
}

export type User = typeof users.$inferSelect & {
  crowns: number | null
}
