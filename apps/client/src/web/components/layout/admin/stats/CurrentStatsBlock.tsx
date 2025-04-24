import { motion } from "framer-motion"
import type { LucideProps } from "lucide-react"
import React, { type ComponentType } from "react"

import anim from "@client/web/utils/anim"
import { formatCurrency } from "@client/web/utils/helpers/formatCurrency"

type Props = {
  Icon: ComponentType<LucideProps>
  label: string
  value: number
  valueSinceLastMonth: number
  displayCurrency?: boolean
}

const CurrentStatsBlock = ({
  Icon,
  label,
  value,
  valueSinceLastMonth,
  displayCurrency = false,
}: Props) => {
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

  return (
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

        {valueSinceLastMonth >= 0 ? (
          <span className="text-secondary text-sm">
            <span className="text-green-400">+{valueSinceLastMonth}%</span>{" "}
            depuis le mois dernier
          </span>
        ) : (
          <span className="text-secondary text-sm">
            <span className="text-red-500">-{valueSinceLastMonth}%</span> depuis
            le mois dernier
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default CurrentStatsBlock
