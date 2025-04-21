import { z } from "zod"

export const DURATIONS_IN_DAYS = ["3", "7", "14", "30"] as const

export const offerStatus = {
  active: "active",
  sold: "sold",
  expired: "expired",
  canceled: "cancelled",
} as const

export type OfferStatus = (typeof offerStatus)[keyof typeof offerStatus]

export const artifactOfferSchema = z.object({
  userArtifactId: z.string().uuid().min(1),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0),
  duration: z.enum(DURATIONS_IN_DAYS),
  description: z.string().optional(),
})

export type ArtifactOfferSchema = z.infer<typeof artifactOfferSchema>
