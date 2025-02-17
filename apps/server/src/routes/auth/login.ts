import { zValidator } from "@hono/zod-validator"
import { loginSchema, SC } from "@lootopia/common"
import {
  incorrectPassword,
  loginSuccess,
  userNotFound,
  selectUserByEmail,
} from "@server/features/users"
import { setCookie } from "@server/utils/helpers/cookie"
import { signJwt } from "@server/utils/helpers/jwt"
import { comparePassword } from "@server/utils/helpers/password"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { Hono } from "hono"

const app = new Hono()

export const loginRoute = app.post(
  "/login",
  zValidator("json", loginSchema),
  async (c) => {
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
  }
)
