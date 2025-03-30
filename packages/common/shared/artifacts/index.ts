import { z } from "zod"

export const ACCEPTED_FILE_TYPES = [".glb", ".obj", ".fbx", ".stl"] as const

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

export const ARTIFACT_RARITY_TIERS = {
  legendary: 5,
  epic: 15,
  rare: 30,
  uncommon: 60,
  common: Infinity,
} as const

export type ArtifactRarityTier = keyof typeof ARTIFACT_RARITY_TIERS
