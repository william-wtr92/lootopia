import {
  boolean,
  geometry,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { users } from "./users"

export const hunts = pgTable("hunts", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  endDate: timestamp().notNull(),
  mode: boolean().notNull().default(true),
  maxParticipants: integer().default(0),
  active: boolean().notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  organizerId: uuid()
    .notNull()
    .references(() => users.id),
})

export const chests = pgTable(
  "chests",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    description: text(),
    position: geometry("position", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),
    reward: text().notNull(),
    size: integer().notNull().default(80),
    maxUsers: integer().notNull().default(1),
    visibility: boolean().notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    huntId: uuid()
      .notNull()
      .references(() => hunts.id, { onDelete: "cascade" }),
  },
  (t) => [index("chests_position_index").using("gist", t.position)]
)
