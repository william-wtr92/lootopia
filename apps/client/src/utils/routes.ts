export const routes = {
  home: "/",
  admin: {
    dashboard: "/admin",
  },
  auth: {
    register: "/register",
    emailValidation: "/email-validation",
    emailChangeValidation: "/email-change-validation",
    resendEmaiValidation: "/resend-email-validation",
    login: "/login",
    passwordReset: "/password-reset",
    requestPasswordReset: "/request-password-reset",
  },
  users: {
    profile: "/profile",
  },
  hunts: {
    list: "/hunts/list",
    id: (huntId: string) => `/hunts/${huntId}`,
    create: "/hunts/create",
  },
  api: {
    users: {
      me: "users/me",
    },
  },
} as const

export const protectedRoutes = [
  routes.hunts.list,
  routes.admin.dashboard,
  routes.users.profile,
] as const
