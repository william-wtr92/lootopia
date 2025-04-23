/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@lootopia/ui"
import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts"

import { computeConfig } from "./StatsChart"

type Props = {
  data: any[]
  keysToExclude?: string[]
}

const CustomBarChart = ({ data, keysToExclude = ["XAxisLabel"] }: Props) => {
  const keys = [...new Set(Object.keys(data[0]))]

  const valueKeys = keys.filter((key) => !keysToExclude.includes(key))

  const chartConfig = computeConfig(valueKeys) satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid stroke="#E6D9C0" />
        <XAxis
          dataKey="XAxisLabel"
          tickMargin={5}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />

        <Tooltip
          content={
            <ChartTooltipContent
              className="bg-primary font-inherit border-0"
              indicator="dashed"
            />
          }
        />

        <Legend />

        {valueKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            radius={4}
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

export default CustomBarChart
