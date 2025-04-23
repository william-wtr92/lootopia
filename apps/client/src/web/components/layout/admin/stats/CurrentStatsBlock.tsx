import type { LucideProps } from "lucide-react"
import React, { type ComponentType } from "react"

type Props = {
  Icon: ComponentType<LucideProps>
  label: string
  value: string
  valueSinceLastMonth: string
}

const CurrentStatsBlock = ({
  Icon,
  label,
  value,
  valueSinceLastMonth,
}: Props) => {
  return (
    <div className="bg-primaryBg flex flex-1 flex-col gap-4 rounded-md p-4">
      <div className="flex justify-between">
        <span className="text-primary font-medium">{label}</span>
        <Icon className="text-accent" />
      </div>
      <div className="flex flex-col">
        <span className="text-primary text-2xl font-bold">{value}</span>
        <span className="text-secondary text-sm">
          <span className="text-green-400">+{valueSinceLastMonth}%</span> depuis
          le mois dernier
        </span>
      </div>
    </div>
  )
}

export default CurrentStatsBlock
