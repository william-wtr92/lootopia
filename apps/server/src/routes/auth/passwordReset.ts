import { zValidator } from "@hono/zod-validator"
import {
  passwordResetSchema,
  requestPasswordResetSchema,
  SC,
} from "@lootopia/common"
import appConfig from "@server/config"
import { tokenExpired } from "@server/features/global"
import {
  passwordNotMatch,
  waitBeforeRequestingPasswordReset,
  passwordResetRequestSentSuccess,
  passwordResetSuccess,
  selectUserByEmail,
  updatePassword,
  userNotFound,
  type DecodedToken,
} from "@server/features/users"
import { redis } from "@server/utils/clients/redis"
import { JwtError } from "@server/utils/errors/jwt"
import { decodeJwt } from "@server/utils/helpers/jwt"
import { mailBuilder, sendMail } from "@server/utils/helpers/mail"
import { hashPassword } from "@server/utils/helpers/password"
import {
  now,
  oneHour,
  oneHourTTL,
  sevenDaysTTL,
  tenMinutesTTL,
} from "@server/utils/helpers/times"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { Hono } from "hono"

const app = new Hono()

export const passwordResetRoute = app
  .post(
    "/request-password-reset",
    zValidator("json", requestPasswordResetSchema),
    async (c) => {
      const { email } = c.req.valid("json")

      const requestPasswordResetCooldownKey =
        redisKeys.auth.requestPasswordResetCooldown(email)
      const requestPasswordResetCooldown = await redis.get(
        requestPasswordResetCooldownKey
      )

      const passwordResetCooldownKey =
        redisKeys.auth.passwordResetCooldown(email)
      const passwordResetCooldown = await redis.get(passwordResetCooldownKey)

      if (requestPasswordResetCooldown || passwordResetCooldown) {
        return c.json(
          waitBeforeRequestingPasswordReset,
          SC.errors.TOO_MANY_REQUESTS
        )
      }

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const requestPasswordResetMail = await mailBuilder(
        { nickname: user.nickname, email },
        appConfig.sendgrid.template.passwordReset,
        oneHour,
        true
      )

      const passwordResetTokenKey = redisKeys.auth.passwordReset(
        requestPasswordResetMail.dynamic_template_data.token as string
      )

      await redis
        .multi()
        .set(requestPasswordResetCooldownKey, now, "EX", tenMinutesTTL)
        .set(passwordResetTokenKey, now, "EX", oneHourTTL)
        .exec()

      await sendMail(requestPasswordResetMail)

      return c.json(passwordResetRequestSentSuccess, SC.success.OK)
    }
  )
  .post(
    "/reset-password",
    zValidator("json", passwordResetSchema),
    async (c) => {
      const { token, password, confirmPassword } = c.req.valid("json")

      if (password !== confirmPassword) {
        return c.json(passwordNotMatch, SC.errors.BAD_REQUEST)
      }

      const passwordResetTokenKey = redisKeys.auth.passwordReset(token)
      const passwordResetToken = await redis.get(passwordResetTokenKey)

      if (!passwordResetToken) {
        return c.json(tokenExpired, SC.errors.BAD_REQUEST)
      }

      try {
        const decodedToken = await decodeJwt<DecodedToken>(token)
        const email = decodedToken.payload.user.email

        const user = await selectUserByEmail(email)

        if (!user || !user.active) {
          return c.json(userNotFound, SC.errors.BAD_REQUEST)
        }

        const [passwordHash, passwordSalt] = await hashPassword(password)

        await updatePassword(user.email, [passwordHash, passwordSalt])

        const passwordResetCooldownKey =
          redisKeys.auth.passwordResetCooldown(email)

        await redis
          .multi()
          .del(passwordResetTokenKey)
          .set(passwordResetCooldownKey, now, "EX", sevenDaysTTL)
          .exec()

        return c.json(passwordResetSuccess, SC.success.OK)
      } catch (error) {
        throw JwtError(error)
      }
    }
  )
