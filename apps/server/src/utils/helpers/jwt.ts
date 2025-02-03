import appConfig from "@server/config"
import { sign, verify } from "hono/jwt"

import { now } from "./times"

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

export const decodeJwt = async (jwt: string, secret?: string) => {
  return await verify(
    jwt,
    secret ? secret : appConfig.security.jwt.secret,
    appConfig.security.jwt.algorithm
  )
}

export const restructureJwt = async (jwt: string) => {
  const [header, payload, signature] = jwt.split(".")

  return `${header}.${payload}.${signature}`
}
