// ERROR MESSAGES

export const userNotFound = {
  result: "User not found.",
  key: "userNotFound",
} as const

export const accountNotFound = {
  result: "Account not found.",
  key: "accountNotFound",
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

export const accountDisabled = {
  result: "Your account is disabled.",
  key: "accountDisabled",
} as const

export const accountAlreadyDisabled = {
  result: "Your account is already disabled.",
  key: "accountAlreadyDisabled",
} as const

export const missingToken = {
  result: "missing or expired token",
  key: "missingToken",
} as const

export const invalidToken = {
  result: "invalid or e",
  key: "invalidToken",
} as const

export const reactivationFailed = {
  result: "Account reactivation failed",
  key: "reactivationFailed",
} as const

export const reactivationLinkFailed = {
  result: "The reactivation link is invalid or expired.",
  key: "reactivationFailed",
} as const

export const emailRequired = {
  result: "Email is required.",
  key: "emailRequired",
} as const

export const accountAlreadyExist = {
  result: "Your account is already active.",
  key: "accountAlreadyExist",
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

export const updateSuccessWithEmailChange = {
  result: "User updated successfully. Please check your mails to validate it.",
  key: "updateSuccessWithEmailChange",
} as const

export const logoutSuccess = {
  result: "You have successfully logged out.",
  key: "logoutSuccess",
} as const

export const deactivatedSucces = {
  result: "Your account has been deactivated and will be deleted in 6 months.",
  key: "deactivatedSucces",
} as const

export const reactivationSuccess = {
  result: "Your account has been successfully reactivated!",
  key: "reactivationSuccess",
} as const

export const reactivationEmailSuccess = {
  result: "Reactivation email sent successfully.",
  key: "reactivationEmailSuccess",
} as const

export const accountReactivatedSuccess = {
  result: "Your account has been successfully reactivated.",
  key: "accountReactivatedSuccess",
} as const
