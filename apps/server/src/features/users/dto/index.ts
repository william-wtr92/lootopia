import type { User } from "@server/features/users/types"

type AdditionalUserFields = Omit<
  User,
  "nickname" | "email" | "phone" | "birthdate"
>

export const sanitizeUser = <
  T extends keyof AdditionalUserFields,
  WithPrivate extends boolean = true,
>(
  user: User,
  additionalFields: T[] = [],
  options?: { private?: WithPrivate }
) => {
  const additionalData: Pick<User, T> = additionalFields.reduce(
    (acc, field) => {
      acc[field] = user[field]

      return acc
    },
    {} as Pick<User, T>
  )

  const isPrivate = options?.private ?? true

  return {
    id: user.id,
    nickname: user.nickname,
    ...(isPrivate && {
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
    }),
    ...(user.crowns !== undefined ? { crowns: user.crowns } : {}),
    ...(user.progression !== undefined
      ? {
          progression: {
            level: user.progression.level,
            experience: user.progression.experience,
          },
        }
      : {}),
    ...additionalData,
  }
}

export const sanitizeUsers = (users: User[]) => {
  return users.map((user) => ({
    id: user.id,
    nickname: user.nickname,
    avatar: user.avatar,
  }))
}
