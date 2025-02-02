export const routes = {
  home: "/",
  register: "/register",
  profile: "/profile",
  resendEmaiValidation: "/resend-email-validation",
  login: "/login",
} as const

export type Routes = (typeof routes)[keyof typeof routes]
