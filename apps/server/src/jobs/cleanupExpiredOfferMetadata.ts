/* eslint-disable no-console */
import {
  deleteFavoritesForExpiredOffers,
  deleteViewsForExpiredOffers,
  selectOffersExpiredOrSolded,
} from "@server/features/town-hall"
import { CronJob } from "cron"

const cleanupExpiredOfferData = async () => {
  console.info("🧹 Starting cleanup of expired offer data...")

  const expiredOffers = await selectOffersExpiredOrSolded()
  const expiredOfferIds = expiredOffers.map((o) => o.id)

  if (expiredOfferIds.length === 0) {
    console.info("🟢 No expired offers found.")

    return
  }

  await deleteViewsForExpiredOffers(expiredOfferIds)
  await deleteFavoritesForExpiredOffers(expiredOfferIds)

  console.info(
    `✅ Cleanup complete for ${expiredOfferIds.length} expired offers.`
  )
}

export const startOfferCleanupJob = () => {
  const ALL_DAYS_AT_3AM = "0 3 * * *"

  new CronJob(
    ALL_DAYS_AT_3AM,
    cleanupExpiredOfferData,
    null,
    true,
    "Europe/Paris"
  )

  console.log("🕒 Daily cleanup cron scheduled at 3 AM (Europe/Paris)")
}
