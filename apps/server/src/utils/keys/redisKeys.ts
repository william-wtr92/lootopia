export const redisKeys = {
  auth: {
    session: (email: string) => `auth:session:${email}`,
    emailValidation: (token: string) => `auth:email-validation:${token}`,
    emailValidationCooldown: (email: string) =>
      `auth:email-validation-cooldown:${email}`,
  },
} as const
