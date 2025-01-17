import type { InsertUser } from "@lootopia/common"
import { users } from "@lootopia/drizzle"
import { db } from "@server/db/client"

export const insertUser = async (
  data: InsertUser,
  avatarUrl: string,
  [passwordHash, passwordSalt]: string[]
) => {
  await db.insert(users).values({
    email: data.email,
    nickname: data.nickname,
    phone: data.phone,
    avatar: avatarUrl,
    passwordHash,
    passwordSalt,
    birthdate: new Date(data.birthdate),
    gdprValidated: data.gdprValidated,
  })
}
