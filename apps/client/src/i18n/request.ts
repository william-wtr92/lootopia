import { getRequestConfig } from "next-intl/server"

import { routing, type Locale } from "@client/i18n/routing"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`@client/i18n/messages/${locale}.json`)).default,
  }
})
