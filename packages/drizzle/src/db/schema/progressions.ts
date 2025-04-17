import { pgTable, uuid, integer } from "drizzle-orm/pg-core"
import { users } from "./users"
import { defaultLevel, defaultXP } from "@lootopia/common"

export const userLevels = pgTable("user_levels", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  experience: integer("experience").notNull().default(defaultXP),
  level: integer("level").notNull().default(defaultLevel),
})
