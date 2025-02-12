import type { User } from "@lootopia/drizzle"

type AdditionalUserFields = Omit<User, "username" | "email">

export const sanitizeUser = <T extends keyof AdditionalUserFields>(
  user: User,
  additionalFields: T[] = []
) => {
  const additionalData: Pick<User, T> = additionalFields.reduce(
    (acc, field) => {
      acc[field] = user[field]

      return acc
    },
    {} as Pick<User, T>
  )

  return {
    nickname: user.nickname,
    email: user.email,
    phone: user.phone,
    birthdate: user.birthdate,
    ...additionalData,
  }
}
