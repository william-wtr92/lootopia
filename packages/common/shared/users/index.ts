import { defaultLimit, defaultPage } from "@common/global/pagination"
import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  nickname: z.string().max(255),
  email: z.string().email().max(255),
  phone: z.string().max(255),
  password_hash: z.string(),
  password_salt: z.string(),
  birthdate: z.coerce.date(),
  avatar: z.string().nullable().optional(),
  email_validated: z.boolean().default(false),
  gdpr_validated: z.boolean().default(false),
  active: z.boolean().default(true),
  role: z.enum(["user", "admin"]).default("user"),
  created_at: z.coerce.date().default(() => new Date()),
  updated_at: z.coerce.date().default(() => new Date()),
})

export type UserSchema = z.infer<typeof userSchema>

export const userNicknameSchema = z.object({
  nickname: userSchema.shape.nickname,
})

export type UserNicknameSchema = z.infer<typeof userNicknameSchema>

export const userSearchParamsSchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
  search: z.string().optional(),
})

export type UserSearchParamsSchema = z.infer<typeof userSearchParamsSchema>

export const ROLES = {
  admin: "admin",
  partner: "partner",
  user: "user",
} as const

export type Roles = (typeof ROLES)[keyof typeof ROLES]
