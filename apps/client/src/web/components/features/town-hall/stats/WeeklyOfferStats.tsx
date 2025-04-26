import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  Badge,
  ChartTooltipContent,
} from "@lootopia/ui"
import { TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { chartConfig } from "./config"
import type { WeeklyOfferStatsResponse } from "@client/web/services/town-hall/stats/getWeeklyOfferStats"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  stats: WeeklyOfferStatsResponse
}

const WeeklyOfferStats = ({ stats }: Props) => {
  const t = useTranslations("Components.TownHall.Stats.WeeklyOfferStats")

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <TrendingUp className="text-secondary mr-2 size-4" />
            <span>{t("title")}</span>
          </CardTitle>
          <Badge className="bg-success rounded-xl text-white">
            <span>
              {t("variation", {
                variation: stats.variation ?? 0,
              })}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 p-0">
        <ChartContainer config={chartConfig} className="h-full w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weekly || []}>
              <XAxis
                dataKey="day"
                tickFormatter={(day: string) =>
                  translateDynamicKey(t, `days.${day.toLowerCase()}`)
                }
              />

              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip
                cursor={{ fill: "transparent" }}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex w-full items-center gap-2">
                        <div
                          className="size-3 rounded-sm"
                          style={{
                            backgroundColor:
                              name === "sales" ? "rgb(74, 14, 78)" : "#ffd700",
                          }}
                        />
                        <span className="text-xs font-medium capitalize">
                          {name === "sales"
                            ? t("tooltip.sales")
                            : t("tooltip.crowns")}
                        </span>
                        <span className="ml-auto font-mono">
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : value}
                        </span>
                      </div>
                    )}
                  />
                }
              />

              <Bar
                dataKey="sales"
                fill="rgb(74, 14, 78)"
                radius={4}
                yAxisId="left"
              />
              <Bar dataKey="crowns" fill="#ffd700" radius={4} yAxisId="right" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default WeeklyOfferStats
