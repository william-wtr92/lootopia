import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@lootopia/ui"
import { Legend, Pie, PieChart } from "recharts"

import { computeConfig, type BaseChartProps } from "./StatsChart"

const CustomPieChart = ({
  data,
  keysToExclude = ["XAxisLabel"],
}: BaseChartProps) => {
  const allObjectKeys = Object.keys(data[0])
  const valueKeys = allObjectKeys.filter((key) => !keysToExclude.includes(key))

  const nameKey = allObjectKeys[0]
  const valueKey = allObjectKeys[1]

  const dataWithFill = data.map((item, index) => ({
    ...item,
    fill: `var(--chart-${index + 1})`,
  }))

  const chartConfig = computeConfig(valueKeys) satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig}>
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="bg-primary font-inherit border-0"
              indicator="dashed"
              formatter={(value, _, item) => {
                const [percentageKey, percentageValue] = Object.entries(
                  item.payload
                ).pop() as [string, number]

                return (
                  <div className="flex items-center justify-between gap-4">
                    <div
                      className="size-4 rounded-md"
                      style={{ backgroundColor: item.payload.fill }}
                    ></div>
                    <div className="flex flex-col gap-1 text-base">
                      <span className="first:first-letter:uppercase">
                        {valueKey}: {value}
                      </span>
                      <span>
                        {percentageKey} : {percentageValue}%
                      </span>
                    </div>
                  </div>
                )
              }}
              hideLabel={false}
            />
          }
        />
        <Legend />
        <Pie data={dataWithFill} nameKey={nameKey} dataKey={valueKey} label />
      </PieChart>
    </ChartContainer>
  )
}

export default CustomPieChart
