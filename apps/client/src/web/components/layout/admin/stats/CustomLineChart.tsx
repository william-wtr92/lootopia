/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@lootopia/ui"
import React from "react"
import { XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from "recharts"

import { computeConfig } from "./StatsChart"

type Props = {
  data: any[]
  keysToExclude?: string[]
}

const CustomLineChart = ({ data, keysToExclude = ["XAxisLabel"] }: Props) => {
  const keys = [...new Set(Object.keys(data[0]))]

  const valueKeys = keys.filter((key) => !keysToExclude.includes(key))

  const chartConfig = computeConfig(valueKeys) satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig}>
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid stroke="#E6D9C0" />
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
              indicator="dashed"
              hideLabel
            />
          }
        />

        <Legend />

        <Line
          key={valueKeys[0]}
          dataKey="desktop"
          type="monotone"
          name={valueKeys[0]}
          stroke={"var(--color-desktop)"}
          strokeWidth={2}
          dot={{
            r: 4,
            fill: "var(--color-desktop)",
          }}
          activeDot={{
            r: 8,
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export default CustomLineChart
