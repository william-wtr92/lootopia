import { zValidator } from "@hono/zod-validator"
import { reportSchema, SC } from "@lootopia/common"
import {
  insertReport,
  reportAttachementTooLarge,
  reportUploaded,
  userReportedNotFound,
} from "@server/features/reports"
import {
  invalidExtension,
  selectUserByEmail,
  selectUserByNickname,
  userNotFound,
} from "@server/features/users"
import { azureDirectory, uploadImage } from "@server/utils/actions/azureActions"
import {
  allowedMimeTypes,
  defaultMimeType,
  fiftyMo,
} from "@server/utils/helpers/files"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"
import { bodyLimit } from "hono/body-limit"
import mime from "mime"

const app = new Hono()

export const reportUploadRoute = app.post(
  "/",
  bodyLimit({
    maxSize: fiftyMo,
    onError: (c) => {
      return c.json(reportAttachementTooLarge, SC.errors.PAYLOAD_TOO_LARGE)
    },
  }),
  zValidator("form", reportSchema),
  async (c) => {
    const loggedUserEmail = c.get(contextKeys.loggedUserEmail)
    const body = c.req.valid("form")

    const user = await selectUserByEmail(loggedUserEmail)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const reportedUser = await selectUserByNickname(body.reportedNickname)

    if (!reportedUser) {
      return c.json(userReportedNotFound, SC.errors.NOT_FOUND)
    }

    let attachmentUrl

    if (body.attachment) {
      const mimeType = mime.getType(body.attachment.name) || defaultMimeType

      if (!allowedMimeTypes.includes(mimeType)) {
        return c.json(invalidExtension, SC.errors.BAD_REQUEST)
      }

      attachmentUrl = await uploadImage(
        azureDirectory.reports,
        body.attachment,
        mimeType
      )
    }

    insertReport(user.id, reportedUser.id, {
      reason: body.reason,
      description: body.description,
      attachment: attachmentUrl,
    })

    return c.json(reportUploaded, SC.success.CREATED)
  }
)
