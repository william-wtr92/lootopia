import {
  huntParticipationRequests,
  huntParticipations,
} from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"

export const insertParticipation = async (huntId: string, userId: string) => {
  return db.insert(huntParticipations).values({ huntId, userId })
}

export const insertParticipationRequest = async (
  huntId: string,
  userId: string
) => {
  return db.insert(huntParticipationRequests).values({ huntId, userId })
}
