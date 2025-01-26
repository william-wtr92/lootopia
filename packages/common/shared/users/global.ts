export const ROLES = {
  admin: "admin",
  partner: "partner",
  user: "user",
} as const

export type Roles = (typeof ROLES)[keyof typeof ROLES]
