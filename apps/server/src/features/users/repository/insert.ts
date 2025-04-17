import {
  DEFAULT_CROWN_AMOUNT,
  defaultLevel,
  defaultXP,
  type InsertUser,
} from "@lootopia/common"
import { crowns, userLevels, users } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"

export const insertUser = async (
  data: InsertUser,
  avatarUrl: string,
  [passwordHash, passwordSalt]: string[]
) => {
  return db.transaction(async (tx) => {
    const [userInserted] = await tx
      .insert(users)
      .values({
        email: data.email,
        nickname: data.nickname,
        phone: data.phone,
        avatar: avatarUrl,
        passwordHash,
        passwordSalt,
        birthdate: new Date(data.birthdate),
        gdprValidated: data.gdprValidated,
      })
      .returning({
        userId: users.id,
      })

    await tx.insert(crowns).values({
      amount: DEFAULT_CROWN_AMOUNT,
      userId: userInserted.userId,
    })

    await tx.insert(userLevels).values({
      userId: userInserted.userId,
      experience: defaultXP,
      level: defaultLevel,
    })
  })
}
