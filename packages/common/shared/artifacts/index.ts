import { defaultLimit, defaultPage } from "@common/global/pagination"
import { z } from "zod"

export const ACCEPTED_FILE_TYPES = {
  obj: ".obj",
  glb: ".glb",
  fbx: ".fbx",
} as const

export const artifactUploadSchema = z.object({
  name: z.string().min(3),
  file: z.instanceof(File),
})

export type ArtifactUploadSchema = z.infer<typeof artifactUploadSchema>

export const artifactSchema = z.object({
  name: z.string(),
  shaKey: z.string(),
  link: z.string(),
})

export type ArtifactSchema = z.infer<typeof artifactSchema>

export const artifactParamSchema = z.object({
  id: z.string().uuid(),
})

export type ArtifactParamSchema = z.infer<typeof artifactParamSchema>

export const artifactRarity = {
  legendary: "legendary",
  epic: "epic",
  rare: "rare",
  uncommon: "uncommon",
  common: "common",
} as const

export const ARTIFACT_RARITY_TIERS = {
  [artifactRarity.legendary]: 5,
  [artifactRarity.epic]: 15,
  [artifactRarity.rare]: 30,
  [artifactRarity.uncommon]: 60,
  [artifactRarity.common]: Infinity,
} as const

export type ArtifactRarity = keyof typeof ARTIFACT_RARITY_TIERS

export const artifactInventoryQuerySchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
  search: z.string().optional(),
  filters: z
    .enum([
      artifactRarity.legendary,
      artifactRarity.epic,
      artifactRarity.rare,
      artifactRarity.uncommon,
      artifactRarity.common,
    ])
    .optional(),
})

export type ArtifactInventoryQuerySchema = z.infer<
  typeof artifactInventoryQuerySchema
>
