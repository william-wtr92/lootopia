import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { hunts } from "./hunts"
import type { ParticipationRequestStatus } from "@lootopia/common"

export const huntParticipations = pgTable(
  "hunt_participations",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    huntId: uuid("huntId")
      .notNull()
      .references(() => hunts.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueParticipation: uniqueIndex("unique_hunt_participation").on(
      table.userId,
      table.huntId
    ),
  })
)

export const huntParticipationRequests = pgTable(
  "hunt_participation_requests",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    huntId: uuid("huntId")
      .notNull()
      .references(() => hunts.id, { onDelete: "cascade" }),
    status: text("status")
      .$type<ParticipationRequestStatus>()
      .default("pending")
      .notNull(),
    requestedAt: timestamp("requested_at").defaultNow().notNull(),
    respondedAt: timestamp("responded_at"),
  },
  (table) => ({
    uniqueRequest: uniqueIndex("unique_hunt_participation_request").on(
      table.userId,
      table.huntId
    ),
  })
)
