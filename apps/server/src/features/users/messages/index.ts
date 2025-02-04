// ERROR MESSAGES

export const userNotFound = {
  result: "User not found.",
  key: "userNotFound",
} as const

export const emailAlreadyExists = {
  result: "Email already exists.",
  key: "emailAlreadyExists",
} as const

export const nicknameAlreadyExists = {
  result: "Nickname already exists.",
  key: "nicknameAlreadyExists",
} as const

export const phoneAlreadyExists = {
  result: "Phone already exists.",
  key: "phoneAlreadyExists",
} as const

export const passwordNotMatch = {
  result: "Password does not match.",
  key: "passwordNotMatch",
} as const

export const avatarTooLarge = {
  result: "Avatar is too large.",
  key: "avatarTooLarge",
} as const

export const invalidImage = {
  result: "Invalid image.",
  key: "invalidImage",
} as const

export const invalidExtension = {
  result: "Invalid extension.",
  key: "invalidExtension",
} as const

export const tokenNotProvided = {
  result: "No token provided.",
  key: "tokenNotProvided",
} as const

// SUCCESS MESSAGES

export const registerSuccess = {
  result: "You have successfully registered.",
  key: "registerSuccess",
} as const

export const emailValidationSuccess = {
  result: "Email validated.",
  key: "emailValidationSuccess",
} as const
