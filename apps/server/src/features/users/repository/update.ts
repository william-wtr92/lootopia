import type { UpdateUser } from "@lootopia/common"
import { users } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import { eq } from "drizzle-orm"

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
      updatedAt: new Date(),
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
