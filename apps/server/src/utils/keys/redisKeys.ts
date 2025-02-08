export const redisKeys = {
  session: (email: string) => `session:${email}`,
} as const
