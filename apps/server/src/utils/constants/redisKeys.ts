export const redisKeys = {
  auth: {
    emailValidation: (email: string) => `auth:email-validation:${email}`,
  },
}
