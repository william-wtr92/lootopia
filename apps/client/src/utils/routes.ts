export const routes = {
  home: "/",
  register: "/register",
  login: "/login",
  profile: "/profile",
  resendEmaiValidation: "/resend-email-validation",
  login: "/login",
} as const

export type Routes = (typeof routes)[keyof typeof routes]
