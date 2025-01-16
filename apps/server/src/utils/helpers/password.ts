import appConfig from "@server/config"
import { pbkdf2 as pbkdf2Callback, randomBytes } from "crypto"
import { promisify } from "util"

const { iterations, keylen, digest, saltlen, pepper } =
  appConfig.security.password

const pbkdf2 = promisify(pbkdf2Callback)

export const hashPassword = async (
  password: string,
  salt: string = randomBytes(saltlen).toString("hex")
) => {
  const key = await pbkdf2(
    `${password}${pepper}`,
    salt,
    iterations,
    keylen,
    digest
  )

  return [key.toString("hex"), salt]
}

export const comparePassword = async (
  password: string,
  hash: string,
  salt: string
) => {
  const [key] = await hashPassword(password, salt)

  return key === hash
}
