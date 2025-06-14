export const routes = {
  home: "/",
  admin: {
    dashboard: "/admin",
    users: "/admin/users",
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
    profileTriggerTownHall: (offerId: string) => `/profile?offerId=${offerId}`,
    profileNickname: (nickname: string) => `/profile/${nickname}`,
  },
  hunts: {
    list: "/hunts/list",
    create: "/hunts/create",
    drafts: "/hunts/drafts",
    id: (huntId: string) => `/hunts/${huntId}`,
  },
  artifacts: {
    viewer: "/artifacts",
    viewerDetail: (artifactId: string) => `/artifacts/${artifactId}`,
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

export const adminRoutes = [routes.admin.dashboard]
