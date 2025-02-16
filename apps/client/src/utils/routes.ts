export const routes = {
  home: "/",
  admin: {
    dashboard: "/admin",
  },
  auth: {
    register: "/register",
    resendEmaiValidation: "/resend-email-validation",
    login: "/login",
  },
  users: {
    profile: "/profile",
  },
  hunts: {
    list: "/hunts",
    id: (huntId: string) => `/hunts/${huntId}`,
    create: "/hunts/create",
  },
} as const

export const protectedRoutes = [
  routes.hunts.list,
  routes.admin.dashboard,
  routes.users.profile,
] as const
