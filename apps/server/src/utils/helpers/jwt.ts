import { sign } from "hono/jwt"

import { now } from "./times"
import appConfig from "../../config"

const { secret, expiresIn, algorithm } = appConfig.security.jwt

export const signJwt = async <T extends object>(
  payload: T,
  expiration?: number
) => {
  return await sign(
    {
      payload,
      exp: expiration ? expiration : expiresIn,
      nbf: now,
      iat: now,
    },
    secret,
    algorithm
  )
}
