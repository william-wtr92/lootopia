/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from "react"

import CustomBarChart from "./CustomBarChart"
import CustomLineChart from "./CustomLineChart"
import CustomPieChart from "./CustomPieChart"
import { chartType, type ChartType } from "@client/web/utils/def/stats"

type Props = {
  type: ChartType
  title: string
  description: string
  data: any[]
  keysToExclude?: string[]
  displayCurrency?: boolean
}

export type BaseChartProps = {
  data: any[]
  keysToExclude?: string[]
}

export const getColorByIndex = (index: number) => {
  return `var(--chart-${index + 1})`
}

export const computeConfig = <T extends string>(uniqueKeys: T[]) => {
  const config = uniqueKeys.reduce(
    (acc, key, index) => {
      acc[key] = {
        label: key,
        color: `${getColorByIndex(index)}`,
      }

      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return config
}

const StatsChart = (props: Props) => {
  const { type, title, description, data, keysToExclude, displayCurrency } =
    props

  return (
    <div className="bg-primaryBg flex flex-1 flex-col gap-4 rounded-md p-4">
      <div className="space-y-2">
        <h1 className="text-primary text-2xl font-bold">{title}</h1>
        <span className="text-sm text-gray-400">{description}</span>
      </div>

      {type === chartType.line && (
        <CustomLineChart
          data={data}
          keysToExclude={keysToExclude}
          displayCurrency={displayCurrency}
        />
      )}

      {type === chartType.bar && (
        <CustomBarChart data={data} keysToExclude={keysToExclude} />
      )}

      {type === chartType.pie && (
        <CustomPieChart data={data} keysToExclude={keysToExclude} />
      )}
    </div>
  )
}

export default StatsChart
