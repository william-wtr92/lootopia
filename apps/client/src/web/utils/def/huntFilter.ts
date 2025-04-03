export const huntFilterTypeEnum = {
  city: "city",
  name: "name",
  organizer: "organizer",
} as const

export type HuntFilterType =
  (typeof huntFilterTypeEnum)[keyof typeof huntFilterTypeEnum]
