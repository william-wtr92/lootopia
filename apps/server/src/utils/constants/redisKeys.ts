export const redisKeys = {
  auth: {
    emailValidation: (token: string) => `auth:email-validation:${token}`,
    emailValidationCooldown: (email: string) =>
      `auth:email-validation-cooldown:${email}`,
  },
}
