import { SC } from "@lootopia/common"
import { tokenNotProvided, userNotFound } from "@server/features/users"
import { selectUserByEmail } from "@server/features/users/repository/select"
import type { DecodedToken } from "@server/features/users/types"
import { redis } from "@server/utils/clients/redis"
import { getCookie } from "@server/utils/helpers/cookie"
import { decodeJwt } from "@server/utils/helpers/jwt"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import type { MiddlewareHandler } from "hono"
import { createFactory, type Factory } from "hono/factory"

const factory: Factory = createFactory()

export const auth: MiddlewareHandler = factory.createMiddleware(
  async (c, next) => {
    const authToken = await getCookie(c, cookiesKeys.auth.session)

    if (!authToken) {
      return c.json(tokenNotProvided, SC.errors.UNAUTHORIZED)
    }

    try {
      const decodedToken = (await decodeJwt(authToken)) as DecodedToken

      if (decodedToken) {
        const userEmail = decodedToken.payload.user.email

        const redisKey = redisKeys.session(userEmail)
        const userCached = await redis.get(redisKey)

        const user = userCached
          ? JSON.parse(userCached)
          : await selectUserByEmail(userEmail)

        if (!user) {
          return c.json(userNotFound, SC.errors.NOT_FOUND)
        }

        c.set(contextKeys.loggedUserEmail, userEmail)

        await next()
      }

      return c.json(tokenNotProvided, SC.errors.UNAUTHORIZED)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      throw c.json(tokenNotProvided, SC.errors.UNAUTHORIZED)
    }
  }
)
