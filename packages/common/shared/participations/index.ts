import { defaultLimit, defaultPage } from "@common/global/pagination"
import { z } from "zod"

export const defaultParticipationRequestCount = 0 as const

export const participationRequestStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const

export type ParticipationRequestStatus =
  (typeof participationRequestStatus)[keyof typeof participationRequestStatus]

export const participationRequestsQuerySchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
  search: z.string().optional(),
})

export type ParticipationRequestsQuerySchema = z.infer<
  typeof participationRequestsQuerySchema
>

export const participationRequestIds = z.object({
  requestId: z.string().uuid(),
  huntId: z.string().uuid(),
})

export type ParticipationRequestIds = z.infer<typeof participationRequestIds>
