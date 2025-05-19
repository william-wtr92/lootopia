import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@lootopia/ui"
import { motion } from "framer-motion"
import type { LucideProps } from "lucide-react"
import { useTranslations } from "next-intl"
import { type ComponentType } from "react"

import anim from "@client/web/utils/anim"
import { formatCurrency } from "@client/web/utils/helpers/formatCurrency"

type Props = {
  Icon: ComponentType<LucideProps>
  label: string
  value: number
  progressPercentage: number
  lastMonthValue?: number | null
  displayCurrency?: boolean
}

const CurrentStatsBlock = ({
  Icon,
  label,
  value,
  progressPercentage,
  lastMonthValue = null,
  displayCurrency = false,
}: Props) => {
  const t = useTranslations("Pages.Admin.Dashboard.topStats")

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <motion.div
            className="bg-primaryBg flex flex-1 flex-col gap-4 rounded-md p-4"
            {...anim(itemVariant)}
          >
            <div className="flex justify-between">
              <span className="text-primary font-medium">{label}</span>
              <Icon className="text-accent" />
            </div>

            <div className="flex flex-col">
              <span className="text-primary text-2xl font-bold">
                {displayCurrency ? formatCurrency(value) : value}
              </span>

              <span className="text-secondary text-sm">
                {progressPercentage >= 0 ? (
                  <span className="text-success">+{progressPercentage}%</span>
                ) : (
                  <span className="text-error">{progressPercentage}%</span>
                )}{" "}
                {t("sinceLastMonth")}
              </span>
            </div>
          </motion.div>
        </TooltipTrigger>

        {lastMonthValue !== null && (
          <TooltipContent>
            <span className="text-base text-white">
              {`${t("previousMonth")} : ${
                displayCurrency
                  ? formatCurrency(lastMonthValue)
                  : lastMonthValue
              }`}
            </span>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

export default CurrentStatsBlock

const itemVariant = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.3,
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
}
