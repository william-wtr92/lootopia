import { Map, Shovel, User } from "lucide-react"
import React from "react"

import CurrentStatsBlock from "@client/web/components/layout/admin/stats/CurrentStatsBlock"
import StatsChart from "@client/web/components/layout/admin/stats/StatsChart"
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
  return (
    <main className="flex h-screen flex-1 flex-col gap-8 overflow-scroll p-4">
      <h1 className="text-primary text-4xl font-semibold">
        Statistics overview
      </h1>

      <div className="flex w-full flex-nowrap gap-4">
        <CurrentStatsBlock
          Icon={User}
          label="Utilisateurs actifs"
          value="1,234"
          valueSinceLastMonth="123"
        />
        <CurrentStatsBlock
          Icon={Map}
          label="Chasses actives"
          value="1,234"
          valueSinceLastMonth="123"
        />
        <CurrentStatsBlock
          Icon={Shovel}
          label="Nombre de coffres ouverts"
          value="1,234"
          valueSinceLastMonth="123"
        />
        <CurrentStatsBlock
          Icon={User}
          label="Revenus totaux"
          value="1,234"
          valueSinceLastMonth="123"
        />
      </div>

      <div className="grid-rows-auto grid grid-cols-2 gap-4">
        <StatsChart
          type={chartType.bar}
          title="Activité des utilisateurs"
          description="Pourcentage des chasses complétées, en cours et abandonnées"
          data={chartData}
        />
        <StatsChart
          type={chartType.line}
          title="Revenus hebdomadaires"
          description="Pourcentage des chasses complétées, en cours et abandonnées"
          data={chartData}
        />
      </div>
    </main>
  )
}

export default AdminPage
