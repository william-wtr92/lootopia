import { users } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import { lt } from "drizzle-orm"

const deleteInactiveUsers = async () => {
  const today = new Date()

  const usersToDelete = await db.query.users.findMany({
    where: (users, { eq, and, lt }) =>
      and(eq(users.active, false), lt(users.deletionDate, today)),
  })

  if (usersToDelete.length === 0) {
    return
  }

  await db.delete(users).where(lt(users.deletionDate, today))
}

export { deleteInactiveUsers }
