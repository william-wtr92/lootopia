import { DEFAULT_CROWN_AMOUNT, type InsertUser } from "@lootopia/common"
import { crowns, users } from "@lootopia/drizzle"
import { db } from "@server/db/client"

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
  })
}
