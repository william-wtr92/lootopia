import { zValidator } from "@hono/zod-validator"
import {
  reactivateAccountConfirmSchema,
  reactivateAccountRequestSchema,
  SC,
} from "@lootopia/common"
import appConfig from "@server/config"
import { tokenExpired, tokenNotProvided } from "@server/features/global"
import {
  emailRequired,
  emailReactivationSuccess,
  updateReactivationUser,
  userNotFound,
  accountAlreadyActive,
  reactivatedAccountSuccess,
  selectUserByEmail,
  waitBeforeResendAnotherEmail,
  type DecodedToken,
} from "@server/features/users"
import { redis } from "@server/utils/clients/redis"
import { JwtError } from "@server/utils/errors/jwt"
import { decodeJwt } from "@server/utils/helpers/jwt"
import { mailBuilder, sendMail } from "@server/utils/helpers/mail"
import {
  now,
  oneHour,
  oneHourTTL,
  tenMinutesTTL,
} from "@server/utils/helpers/times"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { Hono } from "hono"

const app = new Hono()

export const reactivateAccountRoute = app
  .post(
    "/reactivate-account/request",
    zValidator("json", reactivateAccountRequestSchema),
    async (c) => {
      const { email } = c.req.valid("json")

      if (!email) {
        return c.json(emailRequired, SC.errors.BAD_REQUEST)
      }

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const reactivateAccountEmailCooldownKey =
        redisKeys.auth.reactivateAccountEmailCooldown(user.email)
      const reactivateAccountEmailCooldown = await redis.get(
        reactivateAccountEmailCooldownKey
      )

      if (reactivateAccountEmailCooldown) {
        return c.json(waitBeforeResendAnotherEmail, SC.errors.TOO_MANY_REQUESTS)
      }

      if (user.active) {
        return c.json(accountAlreadyActive, SC.errors.BAD_REQUEST)
      }

      const reactivateAccountMail = await mailBuilder(
        { nickname: user.nickname, email: user.email },
        appConfig.sendgrid.template.reactivateAccount,
        oneHour,
        true
      )

      const reactivateAccountEmailTokenKey =
        redisKeys.auth.reactivateAccountEmail(
          reactivateAccountMail.dynamic_template_data.token as string
        )

      await redis
        .multi()
        .set(reactivateAccountEmailTokenKey, now, "EX", oneHourTTL)
        .set(reactivateAccountEmailCooldownKey, now, "EX", tenMinutesTTL)
        .exec()

      await sendMail(reactivateAccountMail)

      return c.json(emailReactivationSuccess, SC.success.OK)
    }
  )
  .post(
    "/reactivate-account/confirm",
    zValidator("query", reactivateAccountConfirmSchema),
    async (c) => {
      const token = c.req.query("token")

      if (!token) {
        return c.json(tokenNotProvided, SC.errors.BAD_REQUEST)
      }

      const reactivateAccountEmailTokenKey =
        redisKeys.auth.reactivateAccountEmail(token)
      const reactivateAccountEmailToken = await redis.get(
        reactivateAccountEmailTokenKey
      )

      if (!reactivateAccountEmailToken) {
        return c.json(tokenExpired, SC.errors.BAD_REQUEST)
      }

      try {
        const decodedToken = await decodeJwt<DecodedToken>(token)
        const email = decodedToken.payload.user.email

        if (!email) {
          return c.json(tokenExpired, SC.errors.BAD_REQUEST)
        }

        const user = await selectUserByEmail(email)

        if (!user) {
          return c.json(userNotFound, SC.errors.NOT_FOUND)
        }

        if (user.active) {
          return c.json(accountAlreadyActive, SC.errors.BAD_REQUEST)
        }

        await updateReactivationUser(email)

        await redis.del(reactivateAccountEmailTokenKey)

        return c.json(reactivatedAccountSuccess, SC.success.OK)
      } catch (error) {
        throw JwtError(error)
      }
    }
  )
