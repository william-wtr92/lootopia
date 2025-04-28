import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@lootopia/ui"
import { ChartPie } from "lucide-react"
import { useTranslations } from "next-intl"
import { Cell, Label, Pie, PieChart } from "recharts"

import { chartConfig } from "./config"
import type { OfferRarityStatsResponse } from "@client/web/services/town-hall/stats/getOfferRarityStats"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  stats: OfferRarityStatsResponse
}

const OfferRarityStats = ({ stats }: Props) => {
  const t = useTranslations("Components.TownHall.Stats.OfferRarityStats")

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <ChartPie className="text-secondary mr-2 size-4" />
            <span>{t("title")}</span>
          </div>
          <Badge className="text-accent rounded-xl">
            <span>
              {t("variation", {
                variation: stats?.variation ?? 0,
              })}
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-bold">
                        <div
                          className="size-3 rounded-sm"
                          style={{
                            backgroundColor:
                              rarityColorMap[(name as string).toLowerCase()],
                          }}
                        />
                        {translateDynamicKey(t, `labels.${name}`)}
                      </div>
                      <div className="text-sm">
                        {t("salesByRarity", {
                          count: typeof value === "number" ? value : 0,
                        })}
                      </div>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={stats?.rarityStats}
              dataKey="sales"
              nameKey="rarity"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={5}
            >
              {stats?.rarityStats?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={rarityColorMap[entry.rarity.toLowerCase()]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {stats?.total ?? 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {t("sales")}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default OfferRarityStats

const rarityColorMap: Record<string, string> = {
  common: "#9CA3AF",
  uncommon: "#4ADE80",
  rare: "#60A5FA",
  epic: "#A78BFA",
  legendary: "#FBBF24",
}
