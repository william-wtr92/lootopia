import sgMail from "@sendgrid/mail"
import appConfig from "@server/config"

import { signJwt } from "./jwt"
import { oneHour } from "./times"

type MailData = {
  email: string
}

type DynamicData = {
  token?: string
}

type MailBuild<T> = {
  to: string
  from: string
  templateId: string
  dynamic_template_data: T & DynamicData
}

export const mailBuilder = async <T extends MailData>(
  data: T,
  templateId: string,
  expiration?: number,
  withToken?: boolean
) => {
  const dynamicData: T & DynamicData = {
    ...data,
    baseUrl: appConfig.sendgrid.baseUrl,
  }

  if (withToken) {
    dynamicData.token = await signJwt(
      {
        user: {
          email: data.email,
        },
      },
      expiration ? expiration : oneHour
    )
  }

  sgMail.setApiKey(appConfig.sendgrid.key)

  const sendGridMail: MailBuild<T> = {
    to: data.email,
    from: appConfig.sendgrid.sender,
    templateId: templateId,
    dynamic_template_data: dynamicData,
  }

  return sendGridMail
}

export const sendMail = async (mail: MailBuild<MailData>) => {
  await sgMail.send(mail)
}
