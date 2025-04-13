import { zValidator } from "@hono/zod-validator"
import {
  crownCosts,
  defaultLimit,
  defaultPage,
  huntIdSchema,
  participationRequestIds,
  participationRequestsParamsSchema,
  participationRequestStatus,
  SC,
  transactionTypes,
} from "@lootopia/common"
import {
  selectCrownsByUserId,
  updateHuntCrownsTransaction,
  userRequestingNotHaveEnoughCrowns,
} from "@server/features/crowns"
import { huntNotFound, selectHuntById } from "@server/features/hunts"
import {
  cannotRequestOnPublicHunt,
  deleteParticipationRequest,
  insertParticipationRequest,
  organizerCannotBeParticipant,
  participationAlreadyExists,
  participationRequestDeleted,
  participationRequestNotFound,
  participationRequestSuccess,
  selectParticipationRequestByHuntIdAndUserId,
  userIsNotOrganizerOfHunt,
  updateRequestAndInsertParticipation,
  updateRejectedRequestParticipation,
  updateParticipationRequestToPending,
  cannotResendRequestYet,
  selectParticipationRequestByHuntIdAndRequestId,
  participationRequestAccepted,
  participationRequestRejected,
  selectParticipationRequestsByHuntId,
  selectParticipationRequestsByHuntIdCount,
} from "@server/features/participations"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const requestParticipationRoute = app
  .post(
    "/participate/:huntId/request",
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

      if (hunt.public) {
        return c.json(cannotRequestOnPublicHunt, SC.errors.BAD_REQUEST)
      }

      const existingParticipationRequest =
        await selectParticipationRequestByHuntIdAndUserId(huntId, user.id)

      if (existingParticipationRequest) {
        if (
          existingParticipationRequest.status ===
            participationRequestStatus.REJECTED &&
          existingParticipationRequest.respondedAt
        ) {
          const twentyFourHoursLater = new Date(
            existingParticipationRequest.respondedAt.getTime() +
              24 * 60 * 60 * 1000
          )

          if (twentyFourHoursLater < new Date()) {
            await updateParticipationRequestToPending(
              existingParticipationRequest.id
            )

            return c.json(participationRequestSuccess, SC.success.OK)
          }

          return c.json(cannotResendRequestYet, SC.errors.BAD_REQUEST)
        }

        return c.json(participationAlreadyExists, SC.errors.BAD_REQUEST)
      }

      await insertParticipationRequest(huntId, user.id)

      return c.json(participationRequestSuccess, SC.success.OK)
    }
  )
  .delete(
    "/participate/:huntId/request",
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

      const existingParticipationRequest =
        await selectParticipationRequestByHuntIdAndUserId(huntId, user.id)

      if (!existingParticipationRequest) {
        return c.json(participationRequestNotFound, SC.errors.BAD_REQUEST)
      }

      await deleteParticipationRequest(huntId, user.id)

      return c.json(participationRequestDeleted, SC.success.OK)
    }
  )
  .post(
    "/participate/:huntId/request/:requestId/accept",
    zValidator("param", participationRequestIds),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const { huntId, requestId } = c.req.param()

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const hunt = await selectHuntById(huntId)

      if (!hunt) {
        return c.json(huntNotFound, SC.errors.NOT_FOUND)
      }

      if (user.id !== hunt.organizerId) {
        return c.json(userIsNotOrganizerOfHunt, SC.errors.BAD_REQUEST)
      }

      const request = await selectParticipationRequestByHuntIdAndRequestId(
        huntId,
        requestId
      )

      if (!request) {
        return c.json(participationRequestNotFound, SC.errors.BAD_REQUEST)
      }

      const requestingUserCrowns = await selectCrownsByUserId(request.userId)

      if (!requestingUserCrowns) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      if (requestingUserCrowns.amount <= crownCosts.huntParticipation) {
        return c.json(userRequestingNotHaveEnoughCrowns, SC.errors.BAD_REQUEST)
      }

      await updateRequestAndInsertParticipation(huntId, request.userId)

      await updateHuntCrownsTransaction(
        transactionTypes.huntParticipation,
        huntId,
        request.userId,
        crownCosts.huntParticipation
      )

      return c.json(participationRequestAccepted, SC.success.OK)
    }
  )
  .post(
    "/participate/:huntId/request/:requestId/reject",
    zValidator("param", participationRequestIds),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const { huntId, requestId } = c.req.param()

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const hunt = await selectHuntById(huntId)

      if (!hunt) {
        return c.json(huntNotFound, SC.errors.NOT_FOUND)
      }

      if (user.id !== hunt.organizerId) {
        return c.json(userIsNotOrganizerOfHunt, SC.errors.BAD_REQUEST)
      }

      const request = await selectParticipationRequestByHuntIdAndRequestId(
        huntId,
        requestId
      )

      if (!request) {
        return c.json(participationRequestNotFound, SC.errors.BAD_REQUEST)
      }

      await updateRejectedRequestParticipation(huntId, request.userId)

      return c.json(participationRequestRejected, SC.success.OK)
    }
  )
  .get(
    "/participate/:huntId/requests",
    zValidator("param", huntIdSchema),
    zValidator("query", participationRequestsParamsSchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const huntId = c.req.param("huntId")
      const { limit: limitString, page: offsetString, search } = c.req.query()

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const hunt = await selectHuntById(huntId)

      if (!hunt) {
        return c.json(huntNotFound, SC.errors.NOT_FOUND)
      }

      if (user.id !== hunt.organizerId) {
        return c.json(userIsNotOrganizerOfHunt, SC.errors.BAD_REQUEST)
      }

      const limit = parseInt(limitString, 10) || defaultLimit
      const page = parseInt(offsetString, 10) || defaultPage

      const requests = await selectParticipationRequestsByHuntId(
        huntId,
        limit,
        page,
        search
      )

      const [{ count }] = await selectParticipationRequestsByHuntIdCount(
        huntId,
        search
      )

      const lastPage = Math.ceil(count / limit) - 1

      return c.json(
        {
          result: requests,
          count,
          lastPage,
        },
        SC.success.OK
      )
    }
  )
  .get(
    "/participate/:huntId/requests/count",
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

      if (user.id !== hunt.organizerId) {
        return c.json(userIsNotOrganizerOfHunt, SC.errors.BAD_REQUEST)
      }

      const [{ count }] = await selectParticipationRequestsByHuntIdCount(huntId)

      return c.json({ count }, SC.success.OK)
    }
  )
