export const router = {
  auth: "/auth",
  hunts: "/hunts",
  users: "/users",
  artifacts: "/artifacts",
  reports: "/reports",
  shop: "/shop",
} as const

export const clientRoutes = {
  shop: {
    return: "/shop/return",
  },
} as const
