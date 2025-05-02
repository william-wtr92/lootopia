import { z } from "zod"

export const artifactOfferFavoritesSchema = z.object({
  favorite: z.boolean(),
})

export type ArtifactOfferFavoritesSchema = z.infer<
  typeof artifactOfferFavoritesSchema
>
