import { zValidator } from "@hono/zod-validator"
import { registerSchema, SC } from "@lootopia/common"
import {
  avatarTooLarge,
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
import { uploadImage } from "@server/utils/actions/azureActions"
import { fiftyMo } from "@server/utils/helpers/files"
import { hashPassword } from "@server/utils/helpers/password"
import { Hono } from "hono"
import { bodyLimit } from "hono/body-limit"

const app = new Hono()

export const authRoutes = app.post(
  "/register",
  bodyLimit({
    maxSize: fiftyMo,
    onError: (c) => {
      return c.json(avatarTooLarge, SC.errors.PAYLOAD_TOO_LARGE)
    },
  }),
  zValidator("form", registerSchema),
  async (c) => {
    const body = c.req.valid("form")
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

    const avatarUrl = await uploadImage(c, filteredBody.avatar)

    const [passwordHash, passwordSalt] = await hashPassword(password)

    await insertUser(filteredBody, avatarUrl as string, [
      passwordHash,
      passwordSalt,
    ])

    return c.json(registerSuccess, SC.success.CREATED)
  }
)
