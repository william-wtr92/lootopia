export const routes = {
  home: "/",
  register: "/register",
  resendEmaiValidation: "/resend-email-validation",
  login: "/login",
} as const

export type Routes = (typeof routes)[keyof typeof routes]
