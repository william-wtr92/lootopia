import { z } from "zod"

export const reportReasons = {
  inappropriateBehavior: "inappropriate_behavior",
  cheating: "cheating",
  harassment: "harassment",
  impersonation: "impersonation",
  other: "other",
} as const

export type ReportReason = (typeof reportReasons)[keyof typeof reportReasons]

export const reportSchema = z.object({
  reason: z.enum(
    Object.values(reportReasons) as [ReportReason, ...ReportReason[]]
  ),
  description: z.string().min(1),
  attachment: z.instanceof(File).optional(),
  reportedNickname: z.string(),
})

export type ReportSchema = z.infer<typeof reportSchema>

export const ACCEPTED_ATTATCHMENT_FILE_TYPES = {
  png: ".png",
  jpeg: ".jpeg",
  webp: ".webp",
  jpg: ".jpg",
} as const
