import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core"
import { users } from "./users"

import type { ReportReason } from "@lootopia/common"

export const reports = pgTable("reports", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  reason: text().$type<ReportReason>().notNull(),
  description: text().notNull(),
  attachment: text(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  reporterId: uuid()
    .notNull()
    .references(() => users.id),
  reportedId: uuid()
    .notNull()
    .references(() => users.id),
})
