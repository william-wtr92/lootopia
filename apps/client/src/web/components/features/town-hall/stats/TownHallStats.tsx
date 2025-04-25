import { useQuery } from "@tanstack/react-query"

import OfferRarityStats from "./OfferRarityStats"
import UserOfferStats from "./UserOfferStats"
import WeeklyOfferStats from "./WeeklyOfferStats"
import { getOfferRarityStats } from "@client/web/services/town-hall/stats/getOfferRarityStats"
import { getUserOfferStats } from "@client/web/services/town-hall/stats/getUserOfferStats"
import { getWeeklyOfferStats } from "@client/web/services/town-hall/stats/getWeeklyOfferStats"

const TownHallStats = () => {
  const { data: userOfferStats } = useQuery({
    queryKey: ["userOfferStats"],
    queryFn: getUserOfferStats,
    refetchOnWindowFocus: false,
  })

  const { data: offerRarityStats } = useQuery({
    queryKey: ["offerRarityStats"],
    queryFn: getOfferRarityStats,
    refetchOnWindowFocus: false,
  })

  const { data: weeklyOfferStats } = useQuery({
    queryKey: ["weeklyOfferStats"],
    queryFn: getWeeklyOfferStats,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="text-primary">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {offerRarityStats && <OfferRarityStats stats={offerRarityStats} />}

        {weeklyOfferStats && <WeeklyOfferStats stats={weeklyOfferStats} />}
      </div>

      {userOfferStats && <UserOfferStats stats={userOfferStats} />}
    </div>
  )
}

export default TownHallStats
