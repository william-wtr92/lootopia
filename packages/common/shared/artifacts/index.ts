import { z } from "zod"

export const ACCEPTED_FILE_TYPES = [
  ".glb",
  ".gltf",
  ".obj",
  ".fbx",
  ".stl",
] as const

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
