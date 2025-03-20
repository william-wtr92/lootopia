import { users } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import { getInactiveUsersToDelete } from "@server/features/users"
import { getToday } from "@server/utils/helpers/times"
import { lt } from "drizzle-orm"

const deleteInactiveUsers = async () => {
  const today = getToday()

  const usersToDelete = await getInactiveUsersToDelete(today)


  if (usersToDelete.length === 0) {
    return
  }

  await db.delete(users).where(lt(users.deletionDate, today))
}

export { deleteInactiveUsers }
