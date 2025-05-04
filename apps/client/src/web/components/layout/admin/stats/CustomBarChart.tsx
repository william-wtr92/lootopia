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

import { computeConfig, type BaseChartProps } from "./StatsChart"

const CustomBarChart = ({
  data,
  keysToExclude = ["XAxisLabel"],
}: BaseChartProps) => {
  const allObjectKeys = Object.keys(data[0])

  const valueKeys = allObjectKeys.filter((key) => !keysToExclude.includes(key))

  const chartConfig = computeConfig(valueKeys) satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid />
        <XAxis
          dataKey="XAxisLabel"
          tickMargin={5}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />

        <Tooltip
          content={
            <ChartTooltipContent
              className="bg-primary font-inherit border-0 text-white"
              formatter={(value, _, item) => {
                const dataKey = String(item.dataKey).split("-").join(" ")

                return (
                  <div className="flex items-center justify-between gap-4">
                    <div
                      className="size-4 rounded-md"
                      style={{ backgroundColor: item.color }}
                    ></div>

                    <div className="flex flex-col gap-1 text-base">
                      <span className="first:first-letter:uppercase">
                        {dataKey}: {value}
                      </span>
                    </div>
                  </div>
                )
              }}
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
