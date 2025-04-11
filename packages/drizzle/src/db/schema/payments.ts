import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"
import { users } from "./users"

import type { CrownPackageName, PaymentStatus } from "@lootopia/common"

export const crownPackages = pgTable("crown_packages", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull().$type<CrownPackageName>().unique(),
  crowns: integer().notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  discount: integer(),
  bonus: integer(),
  popular: boolean().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const payments = pgTable("payments", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  crownPackageId: uuid()
    .notNull()
    .references(() => crownPackages.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  providerPaymentId: text().notNull(),
  status: text().$type<PaymentStatus>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
