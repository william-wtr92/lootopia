import { SC } from "@lootopia/common"
import { tokenNotProvided } from "@server/features/global"
import {
  type User,
  sanitizeUser,
  userNotFound,
  selectUserByEmail,
  type DecodedToken,
} from "@server/features/users"
import { redis } from "@server/utils/clients/redis"
import { JwtError } from "@server/utils/errors/jwt"
import { getCookie } from "@server/utils/helpers/cookie"
import { decodeJwt } from "@server/utils/helpers/jwt"
import { oneDayTTL } from "@server/utils/helpers/times"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { createFactory } from "hono/factory"

const factory = createFactory()

export const auth = factory.createMiddleware(async (c, next) => {
  const authToken = await getCookie(c, cookiesKeys.auth.session)

  if (!authToken) {
    return c.json(tokenNotProvided, SC.errors.UNAUTHORIZED)
  }

  try {
    const decodedToken = await decodeJwt<DecodedToken>(authToken)

    if (decodedToken) {
      const userEmail = decodedToken.payload.user.email

      const redisKey = redisKeys.auth.session(userEmail)
      const userCached = await redis.get(redisKey)

      const user: User = userCached
        ? JSON.parse(userCached)
        : await selectUserByEmail(userEmail)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      if (!userCached) {
        const sanitizedUser = sanitizeUser(user, ["id"])

        await redis.set(
          redisKey,
          JSON.stringify(sanitizedUser),
          "EX",
          oneDayTTL
        )
      }

      c.set(contextKeys.loggedUserEmail, user.email)

      await next()
    }

    return c.json(tokenNotProvided, SC.errors.UNAUTHORIZED)
  } catch (error) {
    throw JwtError(error)
  }
})
