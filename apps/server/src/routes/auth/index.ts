import { zValidator } from "@hono/zod-validator"
import { registerSchema, SC, loginSchema } from "@lootopia/common"
import {
  avatarTooLarge,
  emailAlreadyExists,
  insertUser,
  invalidExtension,
  invalidImage,
  nicknameAlreadyExists,
  passwordNotMatch,
  phoneAlreadyExists,
  registerSuccess,
  loginSuccess,
  userNotFound,
  incorrectPassword,
} from "@server/features/users"
import {
  selectUserByEmail,
  selectUserByNickname,
  selectUserByPhone,
} from "@server/features/users/repository/select"
import { uploadImage } from "@server/utils/actions/azureActions"
import { setCookie } from "@server/utils/helpers/cookie"
import {
  allowedMimeTypes,
  defaultMimeType,
  fiftyMo,
} from "@server/utils/helpers/files"
import { signJwt } from "@server/utils/helpers/jwt"
import { comparePassword, hashPassword } from "@server/utils/helpers/password"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { Hono } from "hono"
import { bodyLimit } from "hono/body-limit"
import mime from "mime"

const app = new Hono()

export const authRoutes = app
  .post(
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

      let avatarUrl: string | null = null

      if (filteredBody.avatar) {
        if (!(filteredBody.avatar instanceof File)) {
          return c.json(invalidImage, SC.errors.BAD_REQUEST)
        }

        const mimeType =
          mime.getType(filteredBody.avatar.name) || defaultMimeType

        if (!allowedMimeTypes.includes(mimeType)) {
          return c.json(invalidExtension, SC.errors.BAD_REQUEST)
        }

        avatarUrl = await uploadImage(filteredBody.avatar, mimeType)
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await insertUser(filteredBody, avatarUrl as string, [
        passwordHash,
        passwordSalt,
      ])

      return c.json(registerSuccess, SC.success.CREATED)
    }
  )
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json")
    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const isPasswordValid = await comparePassword(
      password,
      user.passwordHash,
      user.passwordSalt
    )

    if (!isPasswordValid) {
      return c.json(incorrectPassword, SC.errors.UNAUTHORIZED)
    }

    const jwt = await signJwt({
      user: {
        id: user.id,
        email: user.email,
      },
    })

    await setCookie(c, cookiesKeys.auth.session, jwt)

    return c.json(loginSuccess, SC.success.OK)
  })

export default app
