import {
  pgTable,
  text,
  uuid,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

import { users } from "./users"

import type { ArtifactRarity } from "@lootopia/common"
import { chests } from "./hunts"

export const artifacts = pgTable(
  "artifacts",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    link: text().notNull(),
    shaKey: text().notNull(),
    rarity: text("rarity").$type<ArtifactRarity>().notNull().default("common"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    userId: uuid()
      .notNull()
      .references(() => users.id),
  },
  (table) => {
    return {
      shaKeyIndex: uniqueIndex("sha_key_idx").on(table.shaKey),
    }
  }
)

export const userArtifacts = pgTable("user_artifacts", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  artifactId: uuid()
    .notNull()
    .references(() => artifacts.id, { onDelete: "cascade" }),
  obtainedFromChestId: uuid().references(() => chests.id),
  obtainedAt: timestamp("obtained_at").notNull().defaultNow(),
})
