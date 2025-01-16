import { zValidator } from "@hono/zod-validator"
import { registerSchema, SC, type RegisterSchema } from "@lootopia/common"
import {
  emailAlreadyExists,
  insertUser,
  nicknameAlreadyExists,
  passwordNotMatch,
  phoneAlreadyExists,
  registerSuccess,
} from "@server/features/users"
import {
  selectUserByEmail,
  selectUserByNickname,
  selectUserByPhone,
} from "@server/features/users/repository/select"
import { hashPassword } from "@server/utils/helpers/password"
import { Hono } from "hono"

const app = new Hono()

export const authRoutes = app.post(
  "/register",
  zValidator("json", registerSchema),
  async (c) => {
    const body: RegisterSchema = await c.req.json()
    const { password, confirmPassword, ...filteredBody } = body

    if (password !== confirmPassword) {
      return c.json(passwordNotMatch, SC.errors.BAD_REQUEST)
    }

    const user = await selectUserByEmail(filteredBody.email)

    if (user) {
      return c.json(emailAlreadyExists, SC.errors.BAD_REQUEST)
    }

    if (await selectUserByNickname(filteredBody.nickname)) {
      return c.json(nicknameAlreadyExists, SC.errors.BAD_REQUEST)
    }

    if (await selectUserByPhone(filteredBody.phone)) {
      return c.json(phoneAlreadyExists, SC.errors.BAD_REQUEST)
    }

    const [passwordHash, passwordSalt] = await hashPassword(password)

    await insertUser(filteredBody, [passwordHash, passwordSalt])

    return c.json(registerSuccess, SC.success.CREATED)
  }
)
