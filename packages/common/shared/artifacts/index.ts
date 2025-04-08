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
  id: z.string(),
})

export type ArtifactParamSchema = z.infer<typeof artifactParamSchema>

export const ARTIFACT_RARITY_TIERS = {
  legendary: 5,
  epic: 15,
  rare: 30,
  uncommon: 60,
  common: Infinity,
} as const

export type ArtifactRarityTier = keyof typeof ARTIFACT_RARITY_TIERS
