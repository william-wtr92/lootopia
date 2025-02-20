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

export const waitThirtyDaysBeforeUpdatingNickname = {
  result: "Wait 30 days before updating nickname.",
  key: "waitThirtyDaysBeforeUpdatingNickname",
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

export const waitBeforeResendAnotherEmail = {
  result: "Wait before resend another email.",
  key: "waitBeforeResendAnotherEmail",
} as const

export const emailAlreadyValidated = {
  result: "Email already validated.",
  key: "emailAlreadyValidated",
} as const

export const incorrectPassword = {
  result: "The password is incorrect",
  key: "incorrectPassword",
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

export const emailValidationResendSuccess = {
  result: "Email validation resent.",
  key: "emailValidationResendSuccess",
} as const

export const loginSuccess = {
  result: "You have successfully logged in.",
  key: "loginSuccess",
} as const

export const updateSuccess = {
  result: "User updated successfully.",
  key: "updateSuccess",
} as const

export const logoutSuccess = {
  result: "You have successfully logged out.",
  key: "logoutSuccess",
}
