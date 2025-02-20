import { zValidator } from "@hono/zod-validator"
import {
  emailValidationSchema,
  resendEmailValidationSchema,
  SC,
} from "@lootopia/common"
import appConfig from "@server/config"
import { tokenExpired, tokenNotProvided } from "@server/features/global"
import {
  type DecodedToken,
  emailAlreadyValidated,
  emailValidationResendSuccess,
  emailValidationSuccess,
  userNotFound,
  waitBeforeResendAnotherEmail,
  updateEmailValidation,
  selectUserByEmail,
  updateEmail,
} from "@server/features/users"
import { redis } from "@server/utils/clients/redis"
import { JwtError } from "@server/utils/errors/jwt"
import { delCookie } from "@server/utils/helpers/cookie"
import { decodeJwt } from "@server/utils/helpers/jwt"
import { mailBuilder, sendMail } from "@server/utils/helpers/mail"
import {
  now,
  oneHour,
  oneHourTTL,
  tenMinutesTTL,
} from "@server/utils/helpers/times"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { Hono } from "hono"

const app = new Hono()

export const emailValidationRoute = app
  .get(
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
        const decodedToken = await decodeJwt<DecodedToken>(token)
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
  .get(
    "/email-change-validation",
    zValidator("query", emailValidationSchema),
    async (c) => {
      const token = c.req.query("token")

      if (!token) {
        return c.json(tokenNotProvided, SC.errors.BAD_REQUEST)
      }

      const emailTokenKey = redisKeys.auth.emailChangeValidation(token)
      const emailToken = await redis.get(emailTokenKey)

      if (!emailToken) {
        return c.json(tokenExpired, SC.errors.BAD_REQUEST)
      }

      try {
        const decodedToken = await decodeJwt<DecodedToken>(token)
        const oldEmail = decodedToken.payload.user.email
        const newEmail = decodedToken.payload.user.newEmail

        if (!newEmail) {
          return c.json(tokenExpired, SC.errors.BAD_REQUEST)
        }

        updateEmail(oldEmail, newEmail)
        updateEmailValidation(newEmail)

        await redis.del(emailTokenKey)
        delCookie(c, cookiesKeys.auth.session)

        return c.json(emailValidationSuccess, SC.success.OK)
      } catch (error) {
        throw JwtError(error)
      }
    }
  )
  .post(
    "/resend-email-validation",
    zValidator("json", resendEmailValidationSchema),
    async (c) => {
      const body = c.req.valid("json")

      const user = await selectUserByEmail(body.email)

      if (!user || !user.active) {
        return c.json(userNotFound, SC.errors.BAD_REQUEST)
      }

      if (user.emailValidated) {
        return c.json(emailAlreadyValidated, SC.errors.BAD_REQUEST)
      }

      const emailValidationCooldownKey = redisKeys.auth.emailValidationCooldown(
        user.email
      )
      const emailValidationCooldown = await redis.get(
        emailValidationCooldownKey
      )

      if (emailValidationCooldown) {
        return c.json(waitBeforeResendAnotherEmail, SC.errors.BAD_REQUEST)
      }

      const validationMail = await mailBuilder(
        { nickname: user.nickname, email: user.email },
        appConfig.sendgrid.template.register,
        oneHour,
        true
      )

      const emailTokenKey = redisKeys.auth.emailValidation(
        validationMail.dynamic_template_data.token as string
      )

      await redis
        .multi()
        .set(emailTokenKey, now, "EX", oneHourTTL)
        .set(emailValidationCooldownKey, now, "EX", tenMinutesTTL)
        .exec()

      await sendMail(validationMail)

      return c.json(emailValidationResendSuccess, SC.success.OK)
    }
  )
