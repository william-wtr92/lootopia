import { users } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import { lt, sql } from "drizzle-orm"

export const deleteInactiveUsers = async () => {
  const sixMonthsAgo = sql`CURRENT_DATE - INTERVAL '6 months'`

  await db.delete(users).where(lt(users.deletionDate, sixMonthsAgo))
}
