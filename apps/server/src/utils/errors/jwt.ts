import { SC } from "@lootopia/common"
import {
  tokenExpired,
  tokenInvalidStructure,
  tokenSignatureMismatched,
  unspecifiedErrorOccurred,
} from "@server/features/global"

import { InternalError } from "./internal"

export const JwtError = <T>(err: T) => {
  if (err instanceof Error && err.name === "JwtTokenSignatureMismatched") {
    throw InternalError(tokenSignatureMismatched, SC.errors.UNAUTHORIZED)
  } else if (err instanceof Error && err.name === "JwtTokenInvalid") {
    throw InternalError(tokenInvalidStructure, SC.errors.UNAUTHORIZED)
  } else if (err instanceof Error && err.name === "JwtTokenExpired") {
    throw InternalError(tokenExpired, SC.errors.UNAUTHORIZED)
  }

  throw InternalError(
    unspecifiedErrorOccurred,
    SC.serverErrors.INTERNAL_SERVER_ERROR
  )
}
