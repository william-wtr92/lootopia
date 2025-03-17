export const huntFilterTypeEnum = {
  city: "city",
  name: "name",
}

export type HuntFilterType =
  (typeof huntFilterTypeEnum)[keyof typeof huntFilterTypeEnum]
