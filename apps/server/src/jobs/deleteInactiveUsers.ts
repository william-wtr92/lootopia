import { deleteInactiveUsers } from "@server/features/users"

export const deleteInactiveUsersJob = async () => {
  await deleteInactiveUsers()
}
