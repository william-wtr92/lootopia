import { defaultLimit, defaultPage } from "@common/global/pagination"
import { z } from "zod"

export const reportReasons = {
  inappropriateBehavior: "inappropriate_behavior",
  cheating: "cheating",
  harassment: "harassment",
  impersonation: "impersonation",
  other: "other",
} as const

export type ReportReason = (typeof reportReasons)[keyof typeof reportReasons]

export const reportStatus = {
  pending: "pending",
  resolved: "resolved",
  rejected: "rejected",
} as const

export type ReportStatus = (typeof reportStatus)[keyof typeof reportStatus]

export const ACCEPTED_ATTATCHMENT_FILE_TYPES = {
  png: ".png",
  jpeg: ".jpeg",
  webp: ".webp",
  jpg: ".jpg",
} as const

export const reportSchema = z.object({
  reason: z.enum(
    Object.values(reportReasons) as [ReportReason, ...ReportReason[]]
  ),
  description: z.string().min(1),
  attachment: z.instanceof(File).optional(),
  reportedNickname: z.string(),
})

export type ReportSchema = z.infer<typeof reportSchema>

export const reportListQuerySchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
  search: z.string().optional(),
})

export type ReportListQuerySchema = z.infer<typeof reportListQuerySchema>
