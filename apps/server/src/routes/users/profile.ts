import { zValidator } from "@hono/zod-validator"
import { SC, updateSchema } from "@lootopia/common"
import appConfig from "@server/config"
import {
  invalidExtension,
  invalidImage,
  nicknameAlreadyExists,
  phoneAlreadyExists,
  sanitizeUser,
  updateSuccess,
  updateSuccessWithEmailChange,
  userNotFound,
  waitThirtyDaysBeforeUpdatingNickname,
} from "@server/features/users"
import {
  selectUserByEmail,
  selectUserByNickname,
  selectUserByPhone,
} from "@server/features/users/repository/select"
import { updateUser } from "@server/features/users/repository/update"
import { uploadImage } from "@server/utils/actions/azureActions"
import { redis } from "@server/utils/clients/redis"
import { allowedMimeTypes, defaultMimeType } from "@server/utils/helpers/files"
import { mailBuilder, sendMail } from "@server/utils/helpers/mail"
import { hashPassword } from "@server/utils/helpers/password"
import {
  now,
  oneHour,
  oneHourTTL,
  thirtyDaysTTL,
} from "@server/utils/helpers/times"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { Hono } from "hono"
import mime from "mime"

const app = new Hono()

export const profileRoute = app
  .get("/me", async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    return c.json({ result: sanitizeUser(user) }, SC.success.OK)
  })
  .put("/me", zValidator("form", updateSchema), async (c) => {
    const body = c.req.valid("form")
    const loggedUserEmail = c.get(contextKeys.loggedUserEmail)

    const userToUpdate = await selectUserByEmail(loggedUserEmail)

    if (!userToUpdate) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    if (userToUpdate.nickname !== body.nickname) {
      if (await selectUserByNickname(body.nickname)) {
        return c.json(nicknameAlreadyExists, SC.errors.BAD_REQUEST)
      }
    }

    if (userToUpdate.phone !== body.phone) {
      if (await selectUserByPhone(body.phone)) {
        return c.json(phoneAlreadyExists, SC.errors.BAD_REQUEST)
      }
    }

    const [passwordHash, passwordSalt] =
      body.password !== ""
        ? await hashPassword(body.password)
        : [userToUpdate.passwordHash, userToUpdate.passwordSalt]

    let avatarUrl: string | null = null

    if (body.avatar && typeof body.avatar !== "string") {
      if (!(body.avatar instanceof File)) {
        return c.json(invalidImage, SC.errors.BAD_REQUEST)
      }

      const mimeType = mime.getType(body.avatar.name) || defaultMimeType

      if (!allowedMimeTypes.includes(mimeType)) {
        return c.json(invalidExtension, SC.errors.BAD_REQUEST)
      }

      avatarUrl = await uploadImage(body.avatar, mimeType)
    }

    let newNickname: string = userToUpdate.nickname

    if (userToUpdate.nickname !== body.nickname) {
      const redisNicknameKey = redisKeys.users.nicknameUpdateCooldown(
        userToUpdate.id
      )
      const redisNickname = await redis.get(redisNicknameKey)

      if (redisNickname) {
        return c.json(
          waitThirtyDaysBeforeUpdatingNickname,
          SC.errors.BAD_REQUEST
        )
      }

      newNickname = body.nickname
      await redis.set(redisNicknameKey, userToUpdate.id, "EX", thirtyDaysTTL)
    }

    let newEmail = userToUpdate.email

    if (userToUpdate.email !== body.email) {
      newEmail = body.email

      const validationMail = await mailBuilder(
        {
          nickname: body.nickname,
          email: userToUpdate.email,
          newEmail: body.email,
        },
        appConfig.sendgrid.template.emailChangeValidation,
        oneHour,
        true
      )

      const emailTokenKey = redisKeys.auth.emailChangeValidation(
        validationMail.dynamic_template_data.token as string
      )

      await redis.set(emailTokenKey, now, "EX", oneHourTTL)

      await sendMail(validationMail)
    }

    const newPhone =
      userToUpdate.phone === body.phone ? userToUpdate.phone : body.phone

    const newBirthdate =
      userToUpdate.birthdate.toDateString() === body.birthdate
        ? userToUpdate.birthdate.toDateString()
        : body.birthdate

    const newAvatar =
      typeof body.avatar !== "string"
        ? (avatarUrl as string)
        : (userToUpdate.avatar as string)

    const updateSuccessKey =
      userToUpdate.email === body.email
        ? updateSuccess
        : updateSuccessWithEmailChange

    await updateUser(
      {
        nickname: newNickname,
        email: newEmail,
        phone: newPhone,
        birthdate: newBirthdate,
      },
      newAvatar,
      [passwordHash, passwordSalt]
    )

    const redisSessionKey = redisKeys.auth.session(loggedUserEmail)
    await redis.del(redisSessionKey)

    return c.json(updateSuccessKey, SC.success.OK)
  })
