import { reportStatus } from "@lootopia/common"
import { reports } from "@lootopia/drizzle"
import type { InsertReport } from "@server/features/reports/types"
import { db } from "@server/utils/clients/postgres"

export const insertReport = async (
  reporterId: string,
  reportedId: string,
  report: InsertReport
) => {
  return db.insert(reports).values({
    reason: report.reason,
    description: report.description,
    status: reportStatus.pending,
    attachment: report.attachment,
    reporterId,
    reportedId,
  })
}
