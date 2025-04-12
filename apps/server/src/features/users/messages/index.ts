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

export const waitBeforeRequestingPasswordReset = {
  result: "Wait before requesting password reset.",
  key: "waitBeforeRequestingPasswordReset",
} as const

export const mfaAlreadyEnabled = {
  result: "MFA already enabled.",
  key: "mfaAlreadyEnabled",
} as const

export const mfaAlreadyDisabled = {
  result: "MFA already disabled.",
  key: "mfaAlreadyDisabled",
} as const

export const mfaInvalidToken = {
  result: "Invalid MFA token.",
  key: "mfaInvalidToken",
} as const

export const mfaNotEnabled = {
  result: "MFA not enabled.",
  key: "mfaNotEnabled",
} as const

export const mfaSessionExpired = {
  result: "MFA session expired.",
  key: "mfaSessionExpired",
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

export const passwordResetRequestSentSuccess = {
  result: "Password reset request sent.",
  key: "passwordResetRequestSentSuccess",
} as const

export const passwordResetSuccess = {
  result: "Password reset successfully.",
  key: "passwordResetSuccess",
} as const

export const mfaDisabledSuccess = {
  result: "MFA disabled successfully.",
  key: "mfaDisabledSuccess",
} as const

export const mfaVerifySuccess = {
  result: "MFA verified successfully.",
  key: "mfaVerifySuccess",
} as const

export const mfaRequired = {
  result: "MFA required.",
  key: "mfaRequired",
} as const
