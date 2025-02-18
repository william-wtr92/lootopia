export const redisKeys = {
  auth: {
    session: (email: string) => `auth:session:${email}`,
    emailValidation: (token: string) => `auth:email-validation:${token}`,
    emailValidationCooldown: (email: string) =>
      `auth:email-validation-cooldown:${email}`,
  },
  users: {
    nicknameUpdateCooldown: (userId: string) =>
      `users:nickname-update-cooldown:${userId}`,
  },
} as const
