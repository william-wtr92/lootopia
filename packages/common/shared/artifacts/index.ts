import { z } from "zod"

export const ACCEPTED_FILE_TYPES = [
  ".glb",
  ".gltf",
  ".obj",
  ".fbx",
  ".stl",
] as const

export const artifactUploadSchema = z.object({
  file: z.instanceof(File),
})

export type ArtifactUploadSchema = z.infer<typeof artifactUploadSchema>

export const artifactSchema = z.object({
  name: z.string(),
  shaKey: z.string(),
  link: z.string(),
})

export type ArtifactSchema = z.infer<typeof artifactSchema>
