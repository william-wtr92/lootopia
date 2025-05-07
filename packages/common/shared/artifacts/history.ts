import { defaultLimit, defaultPage } from "@common/global/pagination"
import { z } from "zod"

export const historyStatus = {
  discovery: "discovery",
  transfer: "transfer",
  listing: "listing",
} as const

export type HistoryStatus = (typeof historyStatus)[keyof typeof historyStatus]

export const artifactHistoryQuerySchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
})

export type ArtifactHistoryQuerySchema = z.infer<
  typeof artifactHistoryQuerySchema
>

export const userArtifactParamSchema = z.object({
  userArtifactId: z.string().uuid(),
})

export type UserArtifactParamSchema = z.infer<typeof userArtifactParamSchema>
