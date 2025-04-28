"use client"

import { useQuery } from "@tanstack/react-query"
import { Euro, Map, Shovel, User } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import CurrentStatsBlock from "@client/web/components/layout/admin/stats/CurrentStatsBlock"
import StatsChart from "@client/web/components/layout/admin/stats/StatsChart"
import Loader from "@client/web/components/utils/Loader"
import { getMainStats } from "@client/web/services/admin/stats/getMainStats"
import { getOverviewTopStats } from "@client/web/services/admin/stats/getOverviewTopStats"
import { chartType } from "@client/web/utils/def/stats"
import { getMonthByDate } from "@client/web/utils/helpers/getMonthByDate"

const AdminPage = () => {
  const locale = useLocale()
  const t = useTranslations("Pages.Admin.Dashboard")

  const {
    data: topStatsData,
    isFetching: isTopStatsFetching,
    error: isTopStatsError,
  } = useQuery({
    queryKey: ["topStatsOverview"],
    queryFn: () => getOverviewTopStats(),
  })

  const {
    data: mainStatsData,
    isFetching: isMainStatsFetching,
    error: isMainStatsError,
  } = useQuery({
    queryKey: ["mainStatsOverview"],
    queryFn: () => getMainStats(),
  })

  const topStatsIconsLabels = [
    {
      Icon: User,
      label: t("topStats.totalUsers"),
    },
    {
      Icon: Map,
      label: t("topStats.activeHunts"),
    },
    {
      Icon: Shovel,
      label: t("topStats.chestsOpened"),
    },
    {
      Icon: Euro,
      label: t("topStats.monthRevenues"),
      displayCurrency: true,
    },
  ]

  const topStats =
    !isTopStatsFetching && !isTopStatsError && topStatsData?.result
  const mainStats =
    !isMainStatsFetching && !isMainStatsError && mainStatsData?.result

  if (!topStats || !mainStats) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center">
        <Loader label={t("loading")} />
      </div>
    )
  }

  const {
    lastSixMonthsTotalRevenues,
    lastSixMonthsPopularPackages,
    totalUsersHuntParticipationsDifference,
  } = mainStats

  // I did this to avoid repeating the same component usage for each stat, however the order is important
  const topStatsWithIconsLabel = topStatsIconsLabels.map((item, index) => {
    const itemStats = Object.values(topStats)[index]

    return {
      ...item,
      ...itemStats,
    }
  })

  const computedUserHuntParticipationsDifference =
    totalUsersHuntParticipationsDifference.map((item) => ({
      XAxisLabel: getMonthByDate(locale, item.month),
      [t("dataKeys.totalUsers")]: item.totalUsers,
      [t("dataKeys.huntParticipations")]: item.huntParticipations,
    }))

  const computedPopularPackages = lastSixMonthsPopularPackages.map((item) => ({
    XAxisLabel: t(`packs.${item.name!}`),
    [t("dataKeys.amount")]: item.amount,
    [t("dataKeys.percentage")]: item.percentage,
  }))

  const computedMainRevenues = lastSixMonthsTotalRevenues.map((item) => ({
    XAxisLabel: getMonthByDate(locale, item.month),
    [t("dataKeys.amount")]: item.amount,
  }))

  return (
    <main className="flex h-screen flex-1 flex-col gap-8 overflow-scroll p-4">
      <h1 className="text-primary text-4xl font-semibold">{t("title")}</h1>

      <div className="flex w-full flex-nowrap gap-4">
        {topStatsWithIconsLabel.map((item, i) => (
          <CurrentStatsBlock
            key={i}
            Icon={item.Icon}
            label={item.label}
            value={item.value}
            lastMonthValue={item.lastMonthValue}
            progressPercentage={item.percentage ?? 0}
            displayCurrency={item.displayCurrency}
          />
        ))}
      </div>

      <div className="grid-rows-auto grid grid-cols-2 gap-4">
        <StatsChart
          type={chartType.line}
          title={t("mainStats.usersActivity.title")}
          description={t("mainStats.usersActivity.description")}
          data={computedUserHuntParticipationsDifference}
        />

        <StatsChart
          type={chartType.line}
          title={t("mainStats.revenues.title")}
          description={t("mainStats.revenues.description")}
          data={computedMainRevenues}
          displayCurrency={true}
        />

        <StatsChart
          type={chartType.pie}
          title={t("mainStats.popularPackages.title")}
          description={t("mainStats.popularPackages.description")}
          data={computedPopularPackages}
        />
      </div>
    </main>
  )
}

export default AdminPage
