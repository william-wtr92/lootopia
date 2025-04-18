import { z } from "zod"

export const MFA_ISSUER = "Lootopia" as const

export const mfaSchema = z.object({
  token: z.string().length(6),
})

export type MfaSchema = z.infer<typeof mfaSchema>

export const mfaLoginSchema = mfaSchema.extend({
  sessionId: z.string().uuid(),
})

export type MfaLoginSchema = z.infer<typeof mfaLoginSchema>
