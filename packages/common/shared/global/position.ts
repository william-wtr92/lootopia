import { z } from "zod"

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
