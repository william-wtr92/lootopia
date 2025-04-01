import {
  pgTable,
  text,
  uuid,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

import { users } from "./users"
import type { ArtifactRarityTier } from "@common/artifacts"

export const artifacts = pgTable(
  "artifacts",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    link: text().notNull(),
    shaKey: text().notNull(),
    rarity: text("rarity")
      .$type<ArtifactRarityTier>()
      .notNull()
      .default("common"),
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
