"use client"

import { useQuery } from "@tanstack/react-query"
import { Map, Shovel, User } from "lucide-react"
import React from "react"

import CurrentStatsBlock from "@client/web/components/layout/admin/stats/CurrentStatsBlock"
import StatsChart from "@client/web/components/layout/admin/stats/StatsChart"
import Loader from "@client/web/components/utils/Loader"
import { getOverviewTopStats } from "@client/web/services/admin/stats/getOverviewTopStats"
import { chartType } from "@client/web/utils/def/stats"

const chartData = [
  { XAxisLabel: "January", desktop: 186, mobile: 80 },
  { XAxisLabel: "February", desktop: 305, mobile: 200 },
  { XAxisLabel: "March", desktop: 237, mobile: 120 },
  { XAxisLabel: "April", desktop: 73, mobile: 190 },
  { XAxisLabel: "May", desktop: 209, mobile: 130 },
  { XAxisLabel: "June", desktop: 214, mobile: 140 },
]

const AdminPage = () => {
  const { data, isFetching, error } = useQuery({
    queryKey: ["top-stats-overview"],
    queryFn: () => getOverviewTopStats(),
  })

  const statistics = !isFetching && !error && data?.result

  if (!statistics) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center">
        <Loader label="Chargement des statistiques..." />
      </div>
    )
  }

  const usersStats = statistics.usersStats
  const huntsStats = statistics.huntsStats
  const chestsStats = statistics.chestsStats
  const revenuesStats = statistics.revenuesStats

  return (
    <main className="flex h-screen flex-1 flex-col gap-8 overflow-scroll p-4">
      <h1 className="text-primary text-4xl font-semibold">
        Statistics overview
      </h1>

      <div className="flex w-full flex-nowrap gap-4">
        <CurrentStatsBlock
          Icon={User}
          label="Utilisateurs totaux"
          value={usersStats.value}
          valueSinceLastMonth={usersStats.percentage}
        />
        <CurrentStatsBlock
          Icon={Map}
          label="Chasses actives"
          value={huntsStats.value}
          valueSinceLastMonth={huntsStats.percentage}
        />
        <CurrentStatsBlock
          Icon={Shovel}
          label="Nombre de coffres ouverts"
          value={chestsStats.value}
          valueSinceLastMonth={chestsStats.percentage}
        />
        <CurrentStatsBlock
          Icon={User}
          label="Revenus du mois"
          value={revenuesStats.value}
          valueSinceLastMonth={revenuesStats.percentage}
          displayCurrency={true}
        />
      </div>

      <div className="grid-rows-auto grid grid-cols-2 gap-4">
        <StatsChart
          type={chartType.bar}
          title="Activité des utilisateurs"
          description="Statistiques comparant la quantité d'utilisateurs et le nombre de participations sur les 6 derniers mois"
          data={chartData}
        />
        <StatsChart
          type={chartType.line}
          title="Revenus des 6 derniers mois"
          description="Statistiques pour voir l'évolution des revenus sur les 6 derniers mois"
          data={chartData}
        />
      </div>
    </main>
  )
}

export default AdminPage
