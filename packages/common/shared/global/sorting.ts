export const orderType = {
  asc: "asc",
  desc: "desc",
} as const

export type OrderType = keyof typeof orderType

export type SortingType = {
  key: string
  type: OrderType
}

export type Query = {
  limit: number
  page: number
  sorting: SortingType
  search?: string
}
