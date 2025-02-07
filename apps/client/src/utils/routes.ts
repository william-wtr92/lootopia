export const routes = {
  home: "/",
  register: "/register",
  login: "/login",
} as const

export type Routes = (typeof routes)[keyof typeof routes]
