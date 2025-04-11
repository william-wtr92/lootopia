import { z } from "zod"

export const crownPackageName = {
  starterPack: "starter_pack",
  explorerPack: "explorer_pack",
  adventurerPack: "adventurer_pack",
  treasureHunterPack: "treasure_hunter_pack",
  legendaryPack: "legendary_pack",
} as const

export type CrownPackageName =
  (typeof crownPackageName)[keyof typeof crownPackageName]

export const crownPackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  crowns: z.number(),
  price: z.string(),
  discount: z.number().optional().nullable(),
  popular: z.boolean().optional().nullable(),
  bonus: z.number().optional().nullable(),
})

export type CrownPackageSchema = z.infer<typeof crownPackageSchema>

export const packageIdSchema = z.object({
  packageId: crownPackageSchema.shape.id,
})

export type PackageIdSchema = z.infer<typeof packageIdSchema>

export const sessionIdSchema = z.object({
  sessionId: z.string(),
})

export type SessionIdSchema = z.infer<typeof sessionIdSchema>

export const stripeSignatureSchema = z.object({
  "stripe-signature": z.string(),
})

export type StripeSignatureSchema = z.infer<typeof stripeSignatureSchema>

export const stripeReturnUrlParams = {
  sessionId: "session_id",
  success: "success",
} as const

export type StripeReturnUrlParams =
  (typeof stripeReturnUrlParams)[keyof typeof stripeReturnUrlParams]
