import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@lootopia/ui"
import React from "react"
import { XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from "recharts"

import { computeConfig, type BaseChartProps } from "./StatsChart"
import { formatCurrency } from "@client/web/utils/helpers/formatCurrency"

type CustomLineChartProps = BaseChartProps & {
  displayCurrency?: boolean
}

const CustomLineChart = ({
  data,
  keysToExclude = ["XAxisLabel"],
  displayCurrency = false,
}: CustomLineChartProps) => {
  const allObjectKeys = Object.keys(data[0])

  const valueKeys = allObjectKeys.filter((key) => !keysToExclude.includes(key))

  const chartConfig = computeConfig(valueKeys) satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig}>
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid />
        <XAxis
          dataKey="XAxisLabel"
          tickMargin={5}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              className="bg-primary font-inherit border-0"
              formatter={(value, _, item) => {
                const dataKey = String(item.dataKey).split("-").join(" ")

                return (
                  <div className="flex items-center justify-between gap-4 py-1">
                    <div
                      className="size-4 rounded-md"
                      style={{ backgroundColor: item.color }}
                    ></div>

                    <span className="text-base">
                      {`${dataKey} : ${
                        displayCurrency
                          ? formatCurrency(value as number)
                          : value
                      }`}
                    </span>
                  </div>
                )
              }}
            />
          }
        />

        <Legend
          formatter={(value) => {
            return value.split("-").join(" ")
          }}
        />

        {valueKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            name={key}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: `var(--color-${key})`,
            }}
            activeDot={{
              r: 8,
            }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

export default CustomLineChart
