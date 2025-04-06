import { zValidator } from "@hono/zod-validator"
import {
  crownCosts,
  huntIdSchema,
  positionSchema,
  SC,
  transactionTypes,
} from "@lootopia/common"
import {
  notEnoughCrowns,
  selectCrownsByUserId,
  updateHuntCrownsTransaction,
} from "@server/features/crowns"
import {
  huntNotFound,
  noChestFoundInArea,
  noHintFound,
  selectChestInAreaByHuntId,
  selectClosestChestByHuntId,
  selectHuntById,
  updateHuntChestDigged,
  waitBeforeDigging,
  waitBeforeRequestingHint,
} from "@server/features/hunts"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { redis } from "@server/utils/clients/redis"
import { isMovementSuspicious } from "@server/utils/helpers/anticheat"
import {
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
          return c.json(
            { message: "Suspicious movement detected. Digging denied." },
            SC.errors.FORBIDDEN
          )
        }
      }

      const hunt = await selectHuntById(huntId)

      if (!hunt) {
        return c.json(huntNotFound, SC.errors.NOT_FOUND)
      }

      //TD: Verfier que le user est participant du hunt

      const chestInArea = await selectChestInAreaByHuntId(huntId, position)

      if (!chestInArea.length) {
        return c.json(noChestFoundInArea, SC.success.OK)
      }

      const randomIndex = randomInt(0, chestInArea.length)
      const selectedChest = chestInArea[randomIndex]

      await updateHuntChestDigged(
        huntId,
        selectedChest.id,
        selectedChest.maxUsers
      )

      //TD: Enregistrer que tel user a ouvert tel coffre afin de ne pas le réouvrir
      //TD: Attribuer la récompense au user

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
          result: chestInArea,
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
        const huntTimeTTL = Math.floor(
          (new Date(hunt.endDate).getTime() - now) / 1000
        )
        await redis.set(hintCountKey, 1, "EX", huntTimeTTL)
      }

      const userCrowns = await selectCrownsByUserId(user.id)

      const MAX_FREE_HINTS = 3

      if (userCrowns && hintCount && parseInt(hintCount) >= MAX_FREE_HINTS) {
        if (userCrowns?.amount < crownCosts.hintPurchase) {
          return c.json(notEnoughCrowns, SC.errors.FORBIDDEN)
        }
      } else {
        await redis.incr(hintCountKey)
      }

      const [hint] = await selectClosestChestByHuntId(huntId, position)

      if (!hint) {
        return c.json(noHintFound, SC.success.OK)
      }

      const distanceMeters = hint.distance

      await updateHuntCrownsTransaction(
        transactionTypes.hintPurchase,
        huntId,
        user.id,
        crownCosts.hintPurchase
      )

      await redis.set(hintCooldownKey, now, "EX", tenMinutesTTL)

      return c.json(
        {
          result: distanceMeters,
        },
        SC.success.OK
      )
    }
  )
