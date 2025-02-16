import type { User } from "@server/features/users/types"

type AdditionalUserFields = Omit<
  User,
  "nickname" | "email" | "phone" | "birthdate"
>

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
