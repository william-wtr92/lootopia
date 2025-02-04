import { zValidator } from "@hono/zod-validator"
import { emailValidationSchema, SC } from "@lootopia/common"
import { tokenExpired, tokenNotProvided } from "@server/features/global"
import { emailValidationSuccess, userNotFound } from "@server/features/users"
import { selectUserByEmail } from "@server/features/users/repository/select"
import { updateEmailValidation } from "@server/features/users/repository/update"
import { redis } from "@server/utils/clients/redis"
import { redisKeys } from "@server/utils/constants/redisKeys"
import { JwtError } from "@server/utils/errors/jwt"
import { decodeJwt, type CustomPayload } from "@server/utils/helpers/jwt"
import { Hono } from "hono"

const app = new Hono()

export const emailValidationRoute = app.get(
  "/email-validation",
  zValidator("query", emailValidationSchema),
  async (c) => {
    const token = c.req.query("token")

    if (!token) {
      return c.json(tokenNotProvided, SC.errors.BAD_REQUEST)
    }

    const emailTokenKey = redisKeys.auth.emailValidation(token)
    const emailToken = await redis.get(emailTokenKey)

    if (!emailToken) {
      return c.json(tokenExpired, SC.errors.BAD_REQUEST)
    }

    try {
      const decodedToken = await decodeJwt<CustomPayload>(token)
      const email = decodedToken.payload.user.email

      const user = await selectUserByEmail(email)

      if (!user || !user.active) {
        return c.json(userNotFound, SC.errors.BAD_REQUEST)
      }

      updateEmailValidation(email)

      await redis.del(emailTokenKey)

      return c.json(emailValidationSuccess, SC.success.OK)
    } catch (error) {
      throw JwtError(error)
    }
  }
)
