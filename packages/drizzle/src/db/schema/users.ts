import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const users = pgTable(
  "users",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    nickname: varchar({ length: 255 }).unique().notNull(),
    email: varchar({ length: 255 }).unique().notNull(),
    phone: varchar({ length: 255 }).unique().notNull(),
    passwordHash: text("password_hash").notNull(),
    passwordSalt: text("password_salt").notNull(),
    birthdate: timestamp("birthdate").notNull(),
    interests: varchar({ length: 255 }).notNull(),
    rating: integer().notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("email_idx").on(table.email),
      phoneIdx: uniqueIndex("phone_idx").on(table.phone),
      nameIdx: uniqueIndex("name_idx").on(table.nickname),
    }
  }
)
