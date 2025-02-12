import { zValidator } from "@hono/zod-validator"
import { SC } from "@lootopia/common"
import { updateSchema } from "@lootopia/common/shared/users/auth/update"
import {
  invalidExtension,
  invalidImage,
  nicknameAlreadyExists,
  phoneAlreadyExists,
  sanitizeUser,
  updateSuccess,
  userNotFound,
} from "@server/features/users"
import {
  selectUserByEmail,
  selectUserByNickname,
  selectUserByPhone,
} from "@server/features/users/repository/select"
import { updateUser } from "@server/features/users/repository/update"
import { auth } from "@server/middlewares/auth"
import { uploadImage } from "@server/utils/actions/azureActions"
import { allowedMimeTypes, defaultMimeType } from "@server/utils/helpers/files"
import { hashPassword } from "@server/utils/helpers/password"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"
import mime from "mime"

const app = new Hono()

export const usersRoutes = app
  .get("/me", auth, async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    return c.json({ result: sanitizeUser(user) }, SC.success.OK)
  })
  .put("/me", auth, zValidator("form", updateSchema), async (c) => {
    const body = c.req.valid("form")
    const email = c.get(contextKeys.loggedUserEmail)

    const userToUpdate = await selectUserByEmail(email)

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

    await updateUser(
      {
        nickname:
          userToUpdate.nickname === body.nickname
            ? userToUpdate.nickname
            : body.nickname,
        email:
          userToUpdate.email === body.email ? userToUpdate.email : body.email,
        phone:
          userToUpdate.phone === body.phone ? userToUpdate.phone : body.phone,
        birthdate:
          userToUpdate.birthdate.toDateString() === body.birthdate
            ? userToUpdate.birthdate.toDateString()
            : body.birthdate,
      },
      typeof body.avatar !== "string"
        ? (avatarUrl as string)
        : (userToUpdate.avatar as string),
      [passwordHash, passwordSalt]
    )

    return c.json(updateSuccess, SC.success.OK)
  })

export default app
