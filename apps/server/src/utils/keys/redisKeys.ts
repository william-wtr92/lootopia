export const redisKeys = {
  session: (email: string) => `session:${email}`,
  auth: {
    emailValidation: (token: string) => `auth:email-validation:${token}`,
    emailValidationCooldown: (email: string) =>
      `auth:email-validation-cooldown:${email}`,
  },
} as const
