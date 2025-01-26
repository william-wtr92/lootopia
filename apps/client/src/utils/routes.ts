export const routes = {
  home: "/",
  register: "/register",
} as const

export type Routes = (typeof routes)[keyof typeof routes]
