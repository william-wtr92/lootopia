import type { Context } from "hono"
import { getSignedCookie, setSignedCookie, deleteCookie } from "hono/cookie"

import appConfig from "../../config"

const { secret, maxAge } = appConfig.security.cookie

export const getCookie = async (c: Context, key: string) => {
  return await getSignedCookie(c, secret, key)
}

export const setCookie = async (
  c: Context,
  key: string,
  value: string,
  customMaxAge?: number
) => {
  await setSignedCookie(c, key, value, appConfig.security.cookie.secret, {
    maxAge: customMaxAge ? customMaxAge : maxAge,
    sameSite: "Strict",
    path: "/",
    httpOnly: true,
  })
}

export const delCookie = (c: Context, key: string) => {
  deleteCookie(c, key, {
    maxAge: 0,
  })
}
