import { zValidator } from "@hono/zod-validator"
import { mfaSchema, SC } from "@lootopia/common"
import {
  mfaAlreadyDisabled,
  mfaAlreadyEnabled,
  mfaDisabledSuccess,
  mfaInvalidToken,
  mfaNotEnabled,
  mfaVerifySuccess,
  selectUserByEmail,
  updateMFADisable,
  updateMFAEnable,
  updateMFASecret,
  userNotFound,
} from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"
import { authenticator } from "otplib"

const app = new Hono()

export const securityRoute = app
  .get("/security/mfa/enable", async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    if (user.mfaEnabled) {
      return c.json(mfaAlreadyEnabled, SC.errors.BAD_REQUEST)
    }

    const secret = authenticator.generateSecret()

    await updateMFASecret(email, secret)

    const otpauthUrl = authenticator.keyuri(email, "Lootopia", secret)

    return c.json({ result: otpauthUrl }, SC.success.OK)
  })
  .post("/security/mfa/disable", zValidator("json", mfaSchema), async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { token } = await c.req.json()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    if (!user.mfaSecret) {
      return c.json(mfaAlreadyDisabled, SC.errors.BAD_REQUEST)
    }

    const isValid = authenticator.verify({
      token,
      secret: user.mfaSecret,
    })

    if (!isValid) {
      return c.json(mfaInvalidToken, SC.errors.UNAUTHORIZED)
    }

    await updateMFADisable(email)

    return c.json(mfaDisabledSuccess, SC.success.OK)
  })
  .post("/security/mfa/verify", zValidator("json", mfaSchema), async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { token } = await c.req.json()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    if (!user.mfaSecret) {
      return c.json(mfaNotEnabled, SC.errors.BAD_REQUEST)
    }

    const isValid = authenticator.verify({
      token,
      secret: user.mfaSecret,
    })

    if (!isValid) {
      return c.json(mfaInvalidToken, SC.errors.UNAUTHORIZED)
    }

    await updateMFAEnable(email)

    return c.json(mfaVerifySuccess, SC.success.OK)
  })
