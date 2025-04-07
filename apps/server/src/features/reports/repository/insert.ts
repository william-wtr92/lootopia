import { reports } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import type { InsertReport } from "@server/features/reports/types"

export const insertReport = async (
  reporterId: string,
  reportedId: string,
  report: InsertReport
) => {
  return db.insert(reports).values({
    reason: report.reason,
    description: report.description,
    attachment: report.attachment,
    reporterId,
    reportedId,
  })
}
