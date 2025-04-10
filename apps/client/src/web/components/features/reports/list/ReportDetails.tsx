import { AnimatePresence, motion } from "framer-motion"
import { Flag } from "lucide-react"
import { useTranslations } from "next-intl"

import ReportDetailsTabs from "./ReportDetailsTabs"
import type { ReportResponse } from "@client/web/services/reports/getUserReportList"
import anim from "@client/web/utils/anim"

type Props = {
  selectedReport: ReportResponse | null
}

const ReportDetails = ({ selectedReport }: Props) => {
  const t = useTranslations("Components.Users.Reports.List.ReportDetails")

  return (
    <div className="bg-primaryBg h-full w-1/2 overflow-auto">
      <AnimatePresence mode="wait">
        {selectedReport ? (
          <motion.div
            className="p-6"
            key={selectedReport.report.id}
            {...anim(selectionVariant)}
          >
            <ReportDetailsTabs selectedReport={selectedReport} />
          </motion.div>
        ) : (
          <motion.div
            className="flex h-full flex-col items-center justify-center p-6 text-center"
            {...anim(noSelectionVariant)}
          >
            <Flag className="text-primary mb-4 size-16 opacity-30" />
            <h3 className="text-primary mb-2 text-xl font-medium">
              {t("noSelection")}
            </h3>
            <p className="text-secondary">{t("info")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ReportDetails

const selectionVariant = {
  initial: {
    opacity: 0,
    x: 20,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
}

const noSelectionVariant = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
}
