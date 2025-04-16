import { zValidator } from "@hono/zod-validator"
import {
  CHEST_REWARD_TYPES,
  crownCosts,
  huntIdSchema,
  positionSchema,
  SC,
  transactionTypes,
} from "@lootopia/common"
import { insertDiggedUserArtifact } from "@server/features/artifacts"
import {
  notEnoughCrowns,
  selectCrownsByUserId,
  updateDiggedCrownsTransaction,
  updateHuntCrownsTransaction,
} from "@server/features/crowns"
import {
  chestAlreadyDigged,
  chestIssueReportToAdmin,
  huntNotFound,
  noChestFoundInArea,
  noHintFound,
  selectChestIfDigged,
  selectChestInAreaByHuntId,
  selectClosestChestByHuntId,
  selectHuntById,
  supiciousMovement,
  updateHuntChestDigged,
  waitBeforeDigging,
  waitBeforeRequestingHint,
} from "@server/features/hunts"
import {
  selectParticipantByHuntIdAndUserId,
  userIsNotParticipant,
} from "@server/features/participations"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { redis } from "@server/utils/clients/redis"
import { isMovementSuspicious } from "@server/utils/helpers/anticheat"
import {
  huntTimeTTL,
  now,
  oneHourTTL,
  tenMinutesTTL,
  twoMinutesTTL,
} from "@server/utils/helpers/times"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { randomInt } from "crypto"
import { Hono } from "hono"

const app = new Hono()

export const digRoute = app
  .post(
    "/:huntId/dig",
    zValidator("param", huntIdSchema),
    zValidator("json", positionSchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const { huntId } = c.req.param()
      const position = c.req.valid("json")

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const digCooldownKey = redisKeys.hunts.digCooldown(huntId, email)
      const digCooldown = await redis.get(digCooldownKey)

      if (digCooldown) {
        return c.json(waitBeforeDigging, SC.errors.FORBIDDEN)
      }

      const lastDiggedPositionKey = redisKeys.hunts.lastDiggedPosition(email)
      const lastDiggedPosition = await redis.get(lastDiggedPositionKey)

      if (lastDiggedPosition) {
        const { lat, lng, timestamp } = JSON.parse(lastDiggedPosition)

        const suspicious = isMovementSuspicious(
          { lat, lng },
          position,
          timestamp,
          now
        )

        if (suspicious) {
          return c.json(supiciousMovement, SC.errors.FORBIDDEN)
        }
      }

      const hunt = await selectHuntById(huntId)

      if (!hunt) {
        return c.json(huntNotFound, SC.errors.NOT_FOUND)
      }

      const checkParticipation = await selectParticipantByHuntIdAndUserId(
        huntId,
        user.id
      )

      if (!checkParticipation) {
        return c.json(userIsNotParticipant, SC.errors.FORBIDDEN)
      }

      const chestInArea = await selectChestInAreaByHuntId(huntId, position)

      if (!chestInArea.length) {
        return c.json(noChestFoundInArea, SC.errors.NOT_FOUND)
      }

      const randomIndex = randomInt(0, chestInArea.length)
      const selectedChest = chestInArea[randomIndex]

      const checkIfAlreadyDigged = await selectChestIfDigged(
        user.id,
        selectedChest.id
      )

      if (checkIfAlreadyDigged || selectedChest.maxUsers <= 0) {
        return c.json(chestAlreadyDigged, SC.errors.FORBIDDEN)
      }

      if (
        (selectedChest.rewardType === CHEST_REWARD_TYPES.crown &&
          !selectedChest.reward) ||
        (selectedChest.rewardType === CHEST_REWARD_TYPES.artifact &&
          !selectedChest.artifactId)
      ) {
        return c.json(chestIssueReportToAdmin, SC.errors.BAD_REQUEST)
      }

      if (selectedChest.rewardType === CHEST_REWARD_TYPES.artifact) {
        await insertDiggedUserArtifact(
          user.id,
          selectedChest.artifactId!,
          selectedChest.id
        )
      } else if (selectedChest.rewardType === CHEST_REWARD_TYPES.crown) {
        await updateDiggedCrownsTransaction(
          transactionTypes.huntDigging,
          huntId,
          user.id,
          parseInt(selectedChest.reward!, 10)
        )
      }

      await updateHuntChestDigged(
        huntId,
        user.id,
        selectedChest.id,
        selectedChest.maxUsers
      )

      await redis
        .multi()
        .set(digCooldownKey, now, "EX", twoMinutesTTL)
        .set(
          lastDiggedPositionKey,
          JSON.stringify({
            lat: position.lat,
            lng: position.lng,
            timestamp: now,
          }),
          "EX",
          oneHourTTL
        )
        .exec()

      return c.json(
        {
          result: selectedChest,
        },
        SC.success.OK
      )
    }
  )
  .post(
    "/:huntId/hint",
    zValidator("param", huntIdSchema),
    zValidator("json", positionSchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const { huntId } = c.req.param()
      const position = c.req.valid("json")

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const hintCooldownKey = redisKeys.hunts.hintCooldown(huntId, email)
      const hintCooldown = await redis.get(hintCooldownKey)

      if (hintCooldown) {
        return c.json(waitBeforeRequestingHint, SC.errors.FORBIDDEN)
      }

      const hunt = await selectHuntById(huntId)

      if (!hunt) {
        return c.json(huntNotFound, SC.errors.NOT_FOUND)
      }

      const hintCountKey = redisKeys.hunts.hintCount(huntId, email)
      const hintCount = await redis.get(hintCountKey)

      if (!hintCount) {
        const huntTime = huntTimeTTL(hunt.endDate)
        await redis.set(hintCountKey, 1, "EX", Math.max(huntTime, 1))
      }

      const userCrowns = await selectCrownsByUserId(user.id)

      const MAX_FREE_HINTS = 3

      if (userCrowns && hintCount && parseInt(hintCount) >= MAX_FREE_HINTS) {
        if (userCrowns?.amount < crownCosts.hintPurchase) {
          return c.json(notEnoughCrowns, SC.errors.FORBIDDEN)
        }

        await updateHuntCrownsTransaction(
          transactionTypes.hintPurchase,
          huntId,
          user.id,
          crownCosts.hintPurchase
        )
      } else {
        await redis.incr(hintCountKey)
      }

      const [hint] = await selectClosestChestByHuntId(huntId, position)

      if (!hint) {
        return c.json(noHintFound, SC.success.OK)
      }

      /*
        The distance is calculated in meters, but we want to return a range
        of distances to make it less precise and more fun for the user.
        So we add a random number between 5 and 10 to the distance.
        This will give us a range of distances between 5 and 15 meters.
      */
      const imprecision = Math.floor(Math.random() * 6) + 5
      const baseDistance = Math.round(hint.distance)

      const minDistance = baseDistance
      const maxDistance = baseDistance + imprecision

      await redis.set(hintCooldownKey, now, "EX", tenMinutesTTL)

      return c.json(
        {
          result: {
            minDistance,
            maxDistance,
          },
        },
        SC.success.OK
      )
    }
  )
  .get("/:huntId/hint", zValidator("param", huntIdSchema), async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { huntId } = c.req.param()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const isParticipant = await selectParticipantByHuntIdAndUserId(
      huntId,
      user.id
    )

    if (!isParticipant) {
      return c.json(userIsNotParticipant, SC.errors.FORBIDDEN)
    }

    const hintCountKey = redisKeys.hunts.hintCount(huntId, email)
    const hintCooldownKey = redisKeys.hunts.hintCooldown(huntId, email)

    const hintCount = await redis.get(hintCountKey)
    const cooldownTTL = await redis.ttl(hintCooldownKey)

    return c.json(
      {
        result: {
          count: parseInt(hintCount ?? "0"),
          cooldown: Math.max(cooldownTTL, 0),
        },
      },
      SC.success.OK
    )
  })
