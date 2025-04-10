import { reportStatus } from "@lootopia/common"
import { Badge } from "@lootopia/ui"
import { motion } from "framer-motion"
import { Calendar, CheckCircle, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import type { ReportResponse } from "@client/web/services/reports/getUserReportList"
import anim from "@client/web/utils/anim"
import {
  getReportReasonColor,
  getReportStatusColor,
} from "@client/web/utils/def/colors"
import { formatDate } from "@client/web/utils/formatDate"

type Props = {
  reportDetails: ReportResponse
  selectedReport: ReportResponse | null
  handleSelectReport: (reportDetails: ReportResponse) => void
}

const ReportListItem = ({
  reportDetails,
  selectedReport,
  handleSelectReport,
}: Props) => {
  const t = useTranslations("Components.Users.Reports.List.ReportListItem")

  return (
    <motion.div
      key={reportDetails.report.id}
      className={`border-primary/10 hover:bg-primary/5 cursor-pointer border-b px-4 py-3 ${
        selectedReport?.report.id === reportDetails.report.id
          ? "bg-primary/10"
          : ""
      }`}
      onClick={() => handleSelectReport(reportDetails)}
      {...anim(hoverVariants)}
      whileHover="hover"
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              className={getReportReasonColor(reportDetails.report.reason)}
            >
              {t(`reasons.${reportDetails.report.reason}`)}
            </Badge>
            <span className="text-primary/60 text-xs">
              {t("id", {
                id: reportDetails.report.id,
              })}
            </span>
          </div>
          <p className="text-primary mt-1 line-clamp-2 text-sm">
            {reportDetails.report.description}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-primary/60 flex items-center text-xs">
          <Calendar className="mr-1 h-3 w-3" />
          {formatDate(reportDetails.report.createdAt)}
        </div>
        <div>
          <Badge
            className={`flex items-center text-xs ${getReportStatusColor(reportDetails.report.status)}`}
          >
            {reportDetails.report.status === reportStatus.resolved && (
              <CheckCircle className="mr-1 size-2" />
            )}
            {reportDetails.report.status === reportStatus.rejected && (
              <XCircle className="mr-1 size-2" />
            )}
            {t(`status.${reportDetails.report.status}`)}
          </Badge>
        </div>
      </div>
    </motion.div>
  )
}

export default ReportListItem

const hoverVariants = {
  initial: { x: 0 },
  enter: { x: 0 },
  exit: { x: 0 },
  hover: { x: 5 },
}
