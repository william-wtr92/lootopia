/* eslint-disable camelcase */
import { cva } from "class-variance-authority"

export const colorMap = {
  starter_pack: "bg-gradient-to-r from-amber-400 to-amber-600",
  explorer_pack: "bg-gradient-to-r from-blue-400 to-blue-600",
  adventurer_pack: "bg-gradient-to-r from-purple-500 to-purple-700",
  treasure_hunter_pack: "bg-gradient-to-r from-emerald-400 to-emerald-600",
  legendary_pack: "bg-gradient-to-r from-rose-500 to-rose-700",
} as const

export type ColorMap = keyof typeof colorMap

export const cardHeaderVariants = cva("text-white", {
  variants: {
    variant: colorMap,
  },
  defaultVariants: {
    variant: "starter_pack",
  },
})

export const getColorForPackage = (name: ColorMap) => {
  return cardHeaderVariants({ variant: name })
}
