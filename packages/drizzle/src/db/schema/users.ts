import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { ROLES, type Roles } from "@lootopia/common"

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
    avatar: text("avatar"),
    emailValidated: boolean("email_validated").notNull().default(false),
    gdprValidated: boolean("gdpr_validated").notNull().default(false),
    active: boolean().notNull().default(true),
    role: text("role").$type<Roles>().notNull().default(ROLES.user),
    mfaEnabled: boolean("mfa_enabled").notNull().default(false),
    mfaSecret: text("mfa_secret"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("email_idx").on(table.email),
      phoneIdx: uniqueIndex("phone_idx").on(table.phone),
      nicknameIdx: uniqueIndex("nickname_idx").on(table.nickname),
    }
  }
)
