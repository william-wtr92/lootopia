import { SC } from "@lootopia/common"
import { users } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import {
  selectUserByEmail,
  userNotFound,
  accountAlreadyDisabled,
  deactivatedSuccess,
  deactivateUserByEmail,
} from "@server/features/users"
import { auth } from "@server/middlewares/auth"
import { delCookie } from "@server/utils/helpers/cookie"
import { mailBuilder, sendMail } from "@server/utils/helpers/mail"
import { nowDate, sixMonthsDate } from "@server/utils/helpers/times"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { eq } from "drizzle-orm"
import { Hono } from "hono"

const app = new Hono()

export const deactivateAccountRoute = app.post("/deactivate-account", auth, async (c) => {
  const userEmail = c.get(contextKeys.loggedUserEmail)
  
  if (!userEmail) {
    return c.json(userNotFound, SC.errors.NOT_FOUND)
  }

  const user = await selectUserByEmail(userEmail)


  if (!user) {
    return c.json(userNotFound, SC.errors.NOT_FOUND)
  }

  if (!user.active) {
    return c.json(accountAlreadyDisabled, SC.errors.BAD_REQUEST)
  }

  await deactivateUserByEmail(user.email, nowDate, sixMonthsDate);

  delCookie(c, cookiesKeys.auth.session)

  const deactivateMail = await mailBuilder(
    { nickname: user.nickname, email: user.email },
    process.env.SENDGRID_TEMPLATE_DEACTIVATE_ACCOUNT as string
  )

  await sendMail(deactivateMail)

  return c.json(deactivatedSuccess, SC.success.OK)
})
