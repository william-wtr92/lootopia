export const router = {
  auth: "/auth",
  hunts: "/hunts",
  users: "/users",
  artifacts: "/artifacts",
  reports: "/reports",
  shop: "/shop",
  townHall: "/town-hall",
} as const

export const clientRoutes = {
  shop: {
    return: "/shop/return",
  },
} as const
