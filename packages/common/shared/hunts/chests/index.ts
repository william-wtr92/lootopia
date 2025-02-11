import { z } from "zod"

const DEFAULT_CHEST_SIZE = 80 as const

export const chestSchema = z.object({
  id: z.string(),
  position: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  description: z.string().optional(),
  reward: z.string().optional(),
  size: z.number().default(DEFAULT_CHEST_SIZE),
  maxUsers: z.number().default(1),
  visibility: z.boolean().default(false),
})

export type ChestSchema = z.infer<typeof chestSchema>

export const positionSchema = z.object({
  lat: z.string().regex(/^\d+(\.\d+)?$/),
  lng: z.string().regex(/^\d+(\.\d+)?$/),
})

export type PositionSchema = z.infer<typeof positionSchema>

export type PositionCords = {
  lat: number
  lng: number
}

export const parsePosition = (position: PositionSchema) => ({
  lat: parseFloat(position.lat),
  lng: parseFloat(position.lng),
})
