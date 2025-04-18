import { zValidator } from "@hono/zod-validator"
import {
  crownCosts,
  huntIdSchema,
  SC,
  transactionTypes,
} from "@lootopia/common"
import { updateHuntCrownsTransaction } from "@server/features/crowns"
import { huntNotFound, selectHuntById } from "@server/features/hunts"
import {
  cannotJoinPrivateHuntDirectly,
  huntIsFull,
  organizerCannotBeParticipant,
  participationSuccess,
  selectParticipantsByHuntIdCount,
  insertParticipation,
  participationDeleted,
  deleteParticipationAndRequestIfExist,
} from "@server/features/participations"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { requiredCrowns } from "@server/middlewares/requiredCrowns"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const partipateHuntRoute = app
  .post(
    "/participate/:huntId",
    requiredCrowns(crownCosts.huntParticipation),
    zValidator("param", huntIdSchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const huntId = c.req.param("huntId")

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const hunt = await selectHuntById(huntId)

      if (!hunt) {
        return c.json(huntNotFound, SC.errors.NOT_FOUND)
      }

      if (user.id === hunt.organizerId) {
        return c.json(organizerCannotBeParticipant, SC.errors.BAD_REQUEST)
      }

      if (!hunt.public) {
        return c.json(cannotJoinPrivateHuntDirectly, SC.errors.BAD_REQUEST)
      }

      const [{ count }] = await selectParticipantsByHuntIdCount(huntId)

      if (hunt.maxParticipants && count >= hunt.maxParticipants) {
        return c.json(huntIsFull, SC.errors.BAD_REQUEST)
      }

      await insertParticipation(huntId, user.id)

      await updateHuntCrownsTransaction(
        transactionTypes.huntParticipation,
        huntId,
        user.id,
        crownCosts.huntParticipation
      )

      return c.json(participationSuccess, SC.success.OK)
    }
  )
  .delete(
    "/participate/:huntId",
    zValidator("param", huntIdSchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const huntId = c.req.param("huntId")

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const hunt = await selectHuntById(huntId)

      if (!hunt) {
        return c.json(huntNotFound, SC.errors.NOT_FOUND)
      }

      await deleteParticipationAndRequestIfExist(huntId, user.id)

      return c.json(participationDeleted, SC.success.OK)
    }
  )
