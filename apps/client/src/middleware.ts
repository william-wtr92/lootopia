import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { locales } from "@client/i18n/routing"

const middlewareI18n = createMiddleware({
  locales,
  defaultLocale: "en",
})

export default function middleware(request: NextRequest) {
  const defaultLocale = request.headers.get("x-your-custom-locale") || "en"

  const response = middlewareI18n(request)

  response.headers.set("x-your-custom-locale", defaultLocale)

  return response
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
