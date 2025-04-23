import { z } from "zod"

export const artifactOfferIdParam = z.object({
  offerId: z.string().uuid(),
})

export type ArtifactOfferIdParam = z.infer<typeof artifactOfferIdParam>
