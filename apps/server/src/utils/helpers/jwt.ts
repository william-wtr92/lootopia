import appConfig from "@server/config"
import { sign, verify } from "hono/jwt"
import type { JWTPayload } from "hono/utils/jwt/types"

import { now } from "./times"

export type CustomPayload = {
  payload: {
    user: {
      email: string
    }
  }
}

export const signJwt = async <T extends object>(
  payload: T,
  expiration?: number
) => {
  return await sign(
    {
      payload,
      exp: expiration ? expiration : appConfig.security.jwt.expiresIn,
      nbf: now,
      iat: now,
    },
    appConfig.security.jwt.secret,
    appConfig.security.jwt.algorithm
  )
}

export const decodeJwt = async <T extends object>(
  jwt: string,
  secret?: string
) => {
  return (await verify(
    jwt,
    secret ? secret : appConfig.security.jwt.secret,
    appConfig.security.jwt.algorithm
  )) as JWTPayload & T
}
