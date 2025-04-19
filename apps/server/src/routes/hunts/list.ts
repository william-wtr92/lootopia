import { zValidator } from "@hono/zod-validator"
import {
  defaultLimit,
  defaultPage,
  huntListQuerySchema,
  huntMineListQuerySchema,
  participatedHuntQuerySchema,
  participationRequestStatus,
  SC,
  type HuntParticipationStatusQuery,
} from "@lootopia/common"
import {
  selectHunts,
  selectHuntsCount,
  selectOrganizerHuntsCount,
  type HuntWithChestsAndStatus,
} from "@server/features/hunts"
import {
  selectHuntsWhereUserParticipates,
  selectHuntsWhereUserParticipatesCount,
  selectParticipationRequestsByHuntIds,
  selectParticipationsByHuntIds,
} from "@server/features/participations"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const listHuntRoute = app
  .get("/", zValidator("query", huntListQuerySchema), async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { limit: limitString, page: offsetString, name, city } = c.req.query()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const limit = parseInt(limitString, 10) || defaultLimit
    const page = parseInt(offsetString, 10) || defaultPage

    const hunts = await selectHunts({
      page,
      limit,
      filters: {
        name,
        city,
      },
    })

    const [{ count }] = await selectHuntsCount(name, city)

    const huntIds = hunts.map((hunt) => hunt.id)

    const participations = await selectParticipationsByHuntIds(huntIds, user.id)

    const participationRequests = await selectParticipationRequestsByHuntIds(
      huntIds,
      user.id
    )

    const huntsWithStatus = hunts.map((hunt) => {
      if (hunt.public) {
        const participation = participations.find((p) => p.huntId === hunt.id)

        return {
          ...hunt,
          participationStatus: participation
            ? participationRequestStatus.APPROVED
            : null,
        }
      }

      const request = participationRequests.find((p) => p.huntId === hunt.id)

      return {
        ...hunt,
        participationStatus: request?.status || null,
      }
    }) as HuntWithChestsAndStatus[]

    const lastPage = Math.ceil(count / limit) - 1

    return c.json({ result: huntsWithStatus, lastPage })
  })
  .get("/mine", zValidator("query", huntMineListQuerySchema), async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { search, limit: limitString, page: offsetString } = c.req.query()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const limit = parseInt(limitString, 10) || defaultLimit
    const page = parseInt(offsetString, 10) || defaultPage

    const hunts = await selectHunts({
      limit,
      page,
      filters: { search, organizerId: user.id },
    })

    const [{ count }] = await selectOrganizerHuntsCount(user.id)

    const lastPage = Math.ceil(count / limit) - 1

    return c.json({ result: hunts, lastPage })
  })
  .get(
    "/participations",
    zValidator("query", participatedHuntQuerySchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const {
        search,
        limit: limitString,
        page: offsetString,
        status,
      } = c.req.query()

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const limit = parseInt(limitString, 10) || defaultLimit
      const page = parseInt(offsetString, 10) || defaultPage

      const hunts = await selectHuntsWhereUserParticipates(
        user.id,
        limit,
        page,
        search,
        status as HuntParticipationStatusQuery
      )

      const [{ count }] = await selectHuntsWhereUserParticipatesCount(
        user.id,
        search,
        status as HuntParticipationStatusQuery
      )

      const lastPage = Math.ceil(count / limit) - 1

      return c.json({ result: hunts, lastPage })
    }
  )
