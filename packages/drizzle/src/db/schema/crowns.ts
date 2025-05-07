import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import type { TransactionType } from "@lootopia/common"

import { users } from "./users"
import { hunts } from "./hunts"
import { artifactOffers } from "./town-hall"

export const crowns = pgTable(
  "crowns",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    amount: integer().notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    userId: uuid()
      .notNull()
      .references(() => users.id),
  },
  (table) => {
    return {
      userIndex: uniqueIndex("user_idx").on(table.userId),
    }
  }
)

export const transactions = pgTable("transactions", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  type: text().$type<TransactionType>().notNull(),
  amount: integer().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  huntId: uuid().references(() => hunts.id),
  artifactOfferId: uuid().references(() => artifactOffers.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
