import type { InsertUser } from "@lootopia/common"
import { users } from "@lootopia/drizzle"
import { db } from "@server/db/client"

export const insertUser = async (
  data: InsertUser,
  [passwordHash, passwordSalt]: string[]
) => {
  await db.insert(users).values({
    email: data.email,
    nickname: data.nickname,
    phone: data.phone,
    passwordHash,
    passwordSalt,
    birthdate: new Date(data.birthdate),
    gdprValidated: data.gdprValidated,
  })
}
