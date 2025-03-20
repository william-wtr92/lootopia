import { SC } from "@lootopia/common"
import appConfig from "@server/config"
import {
  selectUserByEmail,
  userNotFound,
  deactivatedAccountSuccess,
  deactivateUserByEmail,
  accountDisabled,
} from "@server/features/users"
import { delCookie } from "@server/utils/helpers/cookie"
import { mailBuilder, sendMail } from "@server/utils/helpers/mail"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { Hono } from "hono"

const app = new Hono()

export const deactivateAccountRoute = app.post(
  "/deactivate-account",
  async (c) => {
    const userEmail = c.get(contextKeys.loggedUserEmail)

    if (!userEmail) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const user = await selectUserByEmail(userEmail)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    if (!user.active) {
      return c.json(accountDisabled, SC.errors.BAD_REQUEST)
    }

    await deactivateUserByEmail(user.email)

    delCookie(c, cookiesKeys.auth.session)

    const deactivateMail = await mailBuilder(
      { nickname: user.nickname, email: user.email },
      appConfig.sendgrid.template.deactivateAccount
    )

    await sendMail(deactivateMail)

    return c.json(deactivatedAccountSuccess, SC.success.OK)
  }
)
