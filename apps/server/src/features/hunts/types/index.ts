import type { ParticipationRequestStatus } from "@lootopia/common"
import type { chests, hunts } from "@lootopia/drizzle"
import type { User } from "@server/features/users"

export type Hunt = typeof hunts.$inferSelect
export type Chest = typeof chests.$inferSelect
export type HuntOrganizer = Pick<User, "id" | "nickname" | "avatar">

export type HuntWithChests = Hunt & {
  chests: Chest[]
  organizer: HuntOrganizer | null
  participantCount: number
}

export type HuntWithChestsAndStatus = HuntWithChests & {
  participationStatus?: ParticipationRequestStatus | null
}
