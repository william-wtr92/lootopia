import type { UpdateUser } from "@lootopia/common"
import { users } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { eq, sql } from "drizzle-orm"

export const updateUser = async (
  data: UpdateUser,
  avatarUrl: string,
  [passwordHash, passwordSalt]: string[]
) => {
  await db
    .update(users)
    .set({
      avatar: avatarUrl,
      nickname: data.nickname,
      email: data.email,
      phone: data.phone,
      birthdate: new Date(data.birthdate!),
      passwordHash,
      passwordSalt,
      updatedAt: sql`NOW()`,
    })
    .where(eq(users.email, data.email))
}

export const updateEmail = async (oldMail: string, newMail: string) => {
  return db
    .update(users)
    .set({
      email: newMail,
    })
    .where(eq(users.email, oldMail))
}

export const updateEmailValidation = async (email: string) => {
  return db
    .update(users)
    .set({
      emailValidated: true,
    })
    .where(eq(users.email, email))
}

export const updatePassword = async (
  email: string,
  [passwordHash, passwordSalt]: string[]
) => {
  return db
    .update(users)
    .set({
      passwordHash,
      passwordSalt,
    })
    .where(eq(users.email, email))
}

export const updateMFASecret = async (email: string, secret: string) => {
  return db
    .update(users)
    .set({
      mfaSecret: secret,
    })
    .where(eq(users.email, email))
}

export const updateMFAEnable = async (email: string) => {
  return db
    .update(users)
    .set({
      mfaEnabled: true,
    })
    .where(eq(users.email, email))
}

export const updateMFADisable = async (email: string) => {
  return db
    .update(users)
    .set({
      mfaEnabled: false,
      mfaSecret: null,
    })
    .where(eq(users.email, email))
}

export const updateUserActive = async (email: string, active: boolean) => {
  await db.update(users).set({ active }).where(eq(users.email, email))
}
