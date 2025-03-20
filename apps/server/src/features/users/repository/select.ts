import { db } from "@server/db/client"

export const selectIfUserIsActive = async (email: string) => {
  return await db.query.users.findFirst({
    where: (users, { eq, and }) => and(eq(users.email, email), eq(users.active, true)), 
  })
}

export const selectUserByEmail = async (email: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })
}

export const selectUserByNickname = async (nickname: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.nickname, nickname),
  })
}

export const selectUserByPhone = async (phone: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.phone, phone),
  })
}

export const selectUserWithPassword = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (user) {
    const { passwordHash, passwordSalt, ...sanitizedUser } = user 
    return sanitizedUser
  }

  return null
}

export const getInactiveUsersToDelete = async (today: Date) => {
  return await db.query.users.findMany({
    where: (users, { eq, and, lt }) =>
      and(eq(users.active, false), lt(users.deletionDate, today)),
  })
}

