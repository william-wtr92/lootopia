import { zValidator } from "@hono/zod-validator"
import { loginSchema, mfaLoginSchema, SC } from "@lootopia/common"
import {
  incorrectPassword,
  loginSuccess,
  userNotFound,
  selectUserByEmail,
  logoutSuccess,
  mfaInvalidToken,
  mfaSessionExpired,
  mfaRequired,
  selectUserById,
} from "@server/features/users"
import { auth } from "@server/middlewares/auth"
import { redis } from "@server/utils/clients/redis"
import { delCookie, setCookie } from "@server/utils/helpers/cookie"
import { signJwt } from "@server/utils/helpers/jwt"
import { comparePassword } from "@server/utils/helpers/password"
import { fiveMinutesTTL } from "@server/utils/helpers/times"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { Hono } from "hono"
import { authenticator } from "otplib"
import { v4 as uuidv4 } from "uuid"

const app = new Hono()

export const loginRoute = app
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

    if (user.mfaEnabled) {
      const sessionId = uuidv4()
      const mfaSessionKey = redisKeys.auth.mfaSession(sessionId)

      await redis.set(mfaSessionKey, user.id, "EX", fiveMinutesTTL)

      return c.json(
        {
          ...mfaRequired,
          sessionId,
          mfaRequired: true,
        },
        SC.success.OK
      )
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
  .post("/login/mfa", zValidator("json", mfaLoginSchema), async (c) => {
    const { sessionId, token } = c.req.valid("json")

    const sessionIdKey = redisKeys.auth.mfaSession(sessionId)
    const userId = await redis.get(sessionIdKey)

    if (!userId) {
      return c.json(mfaSessionExpired, SC.errors.UNAUTHORIZED)
    }

    const user = await selectUserById(userId)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    if (!user.mfaSecret) {
      return c.json(mfaInvalidToken, SC.errors.UNAUTHORIZED)
    }

    const isValid = authenticator.verify({
      token,
      secret: user.mfaSecret,
    })

    if (!isValid) {
      return c.json(mfaInvalidToken, SC.errors.UNAUTHORIZED)
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
  .post("/logout", auth, async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    delCookie(c, cookiesKeys.auth.session)

    const sessionKey = redisKeys.auth.session(user.email)
    await redis.del(sessionKey)

    return c.json(logoutSuccess, SC.success.OK)
  })
