import { db } from "@server/db/client"

export const selectIfUserIsActive = async (email: string) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
    columns: {
      id: true,
      nickname: true,
      email: true,
      phone: true,
      birthdate: true,
      active: true,
      avatar: true,
      role: true,
    },
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
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
    columns: {
      email: true,
      passwordHash: true,
      passwordSalt: true,
    },
  })
}
