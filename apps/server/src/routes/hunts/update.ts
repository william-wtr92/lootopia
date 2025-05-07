import { zValidator } from "@hono/zod-validator"
import { SC, huntIdSchema, huntSchema } from "@lootopia/common"
import {
  huntEndDateEarlierThanStartDate,
  huntNotFound,
  huntUpdatedSuccess,
  notHuntOrganizer,
  selectHuntById,
  updateHunt,
} from "@server/features/hunts"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const updateHuntRoute = app.put(
  "/update/:huntId",
  zValidator("param", huntIdSchema),
  zValidator("json", huntSchema),
  async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const huntId = c.req.param("huntId")
    const updatedHunt = c.req.valid("json")

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const hunt = await selectHuntById(huntId)

    if (!hunt) {
      return c.json(huntNotFound, SC.errors.NOT_FOUND)
    }

    const startDate = new Date(updatedHunt.startDate)
    const endDate = new Date(updatedHunt.endDate)

    if (startDate.getTime() >= endDate.getTime()) {
      return c.json(huntEndDateEarlierThanStartDate, SC.errors.BAD_REQUEST)
    }

    if (hunt.organizerId !== user.id) {
      return c.json(notHuntOrganizer, SC.errors.FORBIDDEN)
    }

    await updateHunt(hunt, updatedHunt)

    return c.json(huntUpdatedSuccess, SC.success.OK)
  }
)
