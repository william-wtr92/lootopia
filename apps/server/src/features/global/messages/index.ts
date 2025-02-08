/* DEFAULT MESSAGE */

export const unspecifiedErrorOccurred = {
  result: "An unspecified error occurred.",
  key: "unspecifiedErrorOccurred",
} as const

export const routeNotFound = {
  result: "Route not found.",
  key: "routeNotFound",
} as const

/* TOKEN JWT */

export const tokenNotProvided = {
  result: "No token provided.",
  key: "tokenNotProvided",
} as const

export const tokenExpired = {
  result: "Token has expired.",
  key: "tokenExpired",
} as const

export const tokenInvalidStructure = {
  result: "Token has invalid structure.",
  key: "tokenInvalidStructure",
} as const

export const tokenSignatureMismatched = {
  result: "Token has invalid - signature mismatched.",
  key: "tokenSignatureMismatched",
} as const

export const tokenInvalidScope = {
  result: "Token has invalid scope.",
  key: "tokenInvalidScope",
} as const
