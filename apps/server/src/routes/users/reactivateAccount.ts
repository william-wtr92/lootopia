import { zValidator } from "@hono/zod-validator"
import { loginSchema, SC } from "@lootopia/common"
import { tokenNotProvided } from "@server/features/global"
import {
  emailRequired,
  reactivationEmailSuccess,
  reactivationLinkFailed,
  updateReactivationUser,
  userNotFound,
  accountAlreadyExist,
  accountReactivatedSuccess,
  accountNotFound,
  selectUserByEmail,
  type DecodedToken,
} from "@server/features/users"
import { redis } from "@server/utils/clients/redis"
import { setCookie } from "@server/utils/helpers/cookie"
import { decodeJwt, signJwt } from "@server/utils/helpers/jwt"
import { mailBuilder, sendMail } from "@server/utils/helpers/mail"
import { oneHourTTL } from "@server/utils/helpers/times"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { Hono } from "hono"

const app = new Hono()

const emailSchema = loginSchema.pick({ email: true });

export const reactivateAccountRoute = app
  .post(
    "/reactivate-account/request",
    zValidator("json", emailSchema),
    async (c) => {
      const { email } = c.req.valid("json")

      if (!email) {
        return c.json(emailRequired, SC.errors.BAD_REQUEST)
      }

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(accountNotFound, SC.errors.NOT_FOUND )
      }

      if (user.active) {
        return c.json(accountAlreadyExist, SC.errors.BAD_REQUEST )
      }

      const token = await signJwt(
        { email: user.email }, 86400
      )

      const emailTokenKey = redisKeys.auth.emailValidation(user.email)
      await redis.set(emailTokenKey, token, "EX", oneHourTTL)


      const validationMail = await mailBuilder(
        { nickname: user.nickname, email: user.email },
        process.env.SENDGRID_TEMPLATE_REACTIVATE_ACCOUNT as string,
        oneHourTTL,
        true
      )

      await sendMail(validationMail)

      return c.json(reactivationEmailSuccess, SC.success.OK)
    }
  )

  .post("/reactivate-account/confirm", async (c) => {
    const token = c.req.query("token")

    if (!token) {
      return c.json(tokenNotProvided, SC.errors.BAD_REQUEST)
    }

    // DECODER LE token avec decodeJwt<DecodedToken> et récup le mail
    let decoded: { email: string }
    try {
      decoded = await decodeJwt<{ email: string }>(token)
    } catch (err) {
      return c.json(reactivationLinkFailed, SC.errors.BAD_REQUEST)
    }

    const email = decoded.email
    if (!email) {
      return c.json(reactivationLinkFailed, SC.errors.BAD_REQUEST)
    }

    const emailTokenKey = redisKeys.auth.emailValidation(decoded.email)
    const storedToken = await redis.get(emailTokenKey)

    if (!storedToken || storedToken !== token) {
      return c.json({ message: "Le lien est invalide ou expiré." }, SC.errors.BAD_REQUEST)
    }
    
    if (!email) {
      return c.json(reactivationLinkFailed, SC.errors.BAD_REQUEST)
    }

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    if (user.active) {
      return c.json( accountAlreadyExist, SC.errors.BAD_REQUEST)
    }

    updateReactivationUser(email)

    await redis.del(emailTokenKey)

    const jwt = await signJwt({
      user: {
        id: user.id,
        email: user.email,
      },
    })

    await setCookie(c, cookiesKeys.auth.session, jwt)

    return c.json(accountReactivatedSuccess,SC.success.OK)
  })
