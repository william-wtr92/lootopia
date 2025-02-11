export const routes = {
  home: "/",
  auth: {
    register: "/register",
    resendEmaiValidation: "/resend-email-validation",
    login: "/login",
  },
  hunts: {
    id: (huntId: string) => `/hunts/${huntId}`,
    create: "/hunts/create",
  },
} as const
