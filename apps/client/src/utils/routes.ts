export const routes = {
  home: "/",
  register: "/register",
  resendEmaiValidation: "/resend-email-validation",
} as const

export type Routes = (typeof routes)[keyof typeof routes]
