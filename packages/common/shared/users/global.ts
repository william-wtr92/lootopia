export const ROLES = {
  admin: "admin",
  partner: "partner",
  organiser: "organiser",
  user: "user",
} as const

export type Roles = (typeof ROLES)[keyof typeof ROLES]
