import type { SelectUser } from "@server/features/users/types"

export const sanitizeUser = (user: SelectUser) => {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    birthDate: user.birthdate,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
  }
}
