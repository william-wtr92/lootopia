import { Card, Badge } from "@lootopia/ui"
import { ArrowUp, Crown, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

import type { UserOfferStatsResponse } from "@client/web/services/town-hall/stats/getUserOfferStats"
import {
  formatCrowns,
  formatOfferCrowns,
} from "@client/web/utils/helpers/formatCrowns"

type Props = {
  stats: UserOfferStatsResponse
}

const UserOfferStats = ({ stats }: Props) => {
  const t = useTranslations("Components.TownHall.Stats.UserOfferStats")

  return (
    <Card className="border-primary/20 overflow-hidden p-4 transition-all hover:shadow-md">
      <div className="mb-4 flex items-center">
        <Zap className="text-secondary mr-2 h-5 w-5" />
        <h3 className="text-primary font-bold">{t("title")}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-primary/70 text-sm">
              {t("transactions.label")}
            </span>
            <Badge className="bg-success text-white">
              +{stats?.transactions.delta}
            </Badge>
          </div>
          <div className="text-primary text-2xl font-bold">
            {stats?.transactions?.current}
          </div>
          <div className="text-success mt-1 flex items-center text-xs">
            <ArrowUp className="mr-1 size-3" />
            <span>
              {t("transactions.variation", {
                variation: stats?.transactions.variation ?? 0,
              })}
            </span>
          </div>
        </div>

        <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-primary/70 text-sm">{t("profit.label")}</span>
            <Badge className="bg-accent text-primary">
              + {formatCrowns(stats?.profit.delta ?? null)}
            </Badge>
          </div>
          <div className="text-primary flex items-center gap-2 text-2xl font-bold">
            <span>{formatOfferCrowns(stats?.profit.current ?? null)}</span>
            <Crown className="text-primary" />
          </div>
          <div className="text-success mt-1 flex items-center text-xs">
            <ArrowUp className="mr-1 size-3" />
            <span>
              {t("profit.variation", {
                variation: stats?.profit.variation?.toFixed(2) ?? 0,
              })}
            </span>
          </div>
        </div>

        <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-primary/70 text-sm">
              {t("artifactsSell.label")}
            </span>
            <Badge className="bg-secondary text-white">
              +{stats?.artifacts.delta}
            </Badge>
          </div>
          <div className="text-primary text-2xl font-bold">
            {stats?.artifacts.current}
          </div>
          <div className="text-success mt-1 flex items-center text-xs">
            <ArrowUp className="mr-1 size-3" />
            <span>
              {t("artifactsSell.variation", {
                variation: stats?.artifacts.variation ?? 0,
              })}
            </span>
          </div>
        </div>

        <div className="border-primary/20 bg-primary flex flex-col items-center justify-center gap-2 rounded-lg border p-4">
          <span className="text-accent text-md">{t("activeOffers.label")}</span>
          <div className="text-accent text-2xl font-bold">
            {stats?.activeOffers}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default UserOfferStats
