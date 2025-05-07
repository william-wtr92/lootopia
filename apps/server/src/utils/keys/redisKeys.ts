export const redisKeys = {
  auth: {
    session: (email: string) => `auth:session:${email}`,
    emailValidation: (token: string) => `auth:email-validation:${token}`,
    emailChangeValidation: (token: string) =>
      `auth:email-change-validation:${token}`,
    emailValidationCooldown: (email: string) =>
      `auth:email-validation-cooldown:${email}`,
    requestPasswordResetCooldown: (email: string) =>
      `auth:request-password-reset-cooldown:${email}`,
    passwordReset: (token: string) => `auth:password-reset:${token}`,
    passwordResetCooldown: (email: string) =>
      `auth:password-reset-cooldown:${email}`,
    reactivateAccountEmail: (token: string) =>
      `auth:reactivate-account-email:${token}`,
    reactivateAccountEmailCooldown: (email: string) =>
      `auth:reactivate-account-email-cooldown:${email}`,
    mfaSession: (mfaSessionId: string) => `mfa:session:${mfaSessionId}`,
  },
  users: {
    nicknameUpdateCooldown: (userId: string) =>
      `users:nickname-update-cooldown:${userId}`,
  },
  hunts: {
    digCooldown: (huntId: string, email: string) =>
      `hunts:dig-cooldown:${huntId}:${email}`,
    lastDiggedPosition: (email: string) =>
      `hunts:last-digged-position:${email}`,
    hintCooldown: (huntId: string, email: string) =>
      `hunts:hint-cooldown:${huntId}:${email}`,
    hintCount: (huntId: string, email: string) =>
      `hunts:hint-count:${huntId}:${email}`,
  },
  shop: {
    payments: {
      export: (userId: string) => `shop:payments:export:${userId}`,
    },
  },
} as const
