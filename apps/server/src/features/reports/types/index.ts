import type { ReportSchema } from "@lootopia/common"

export type InsertReport = Omit<
  ReportSchema,
  "attachment" | "reportedNickname"
> & {
  attachment?: string
}
