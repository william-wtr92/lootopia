/* eslint-disable no-console */
import { deleteInactiveUsers } from "@server/features/users"
import { CronJob } from "cron"

const deleteInactiveUsersData = async () => {
  console.info("🧹 Starting cleanup of expired account...")

  await deleteInactiveUsers()

  console.info("✅ Cleanup complete for expired accounts.")
}

export const startDeleteInactiveUsersJob = () => {
  const ALL_DAYS_AT_3AM = "0 3 * * *"

  new CronJob(
    ALL_DAYS_AT_3AM,
    deleteInactiveUsersData,
    null,
    true,
    "Europe/Paris"
  )

  console.log(
    "🕒 Daily inactive users data cleanup cron scheduled at 3 AM (Europe/Paris)"
  )
}
