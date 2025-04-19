/* eslint-disable max-depth */
import { SC } from "@lootopia/common"
import { NextResponse, type NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { env } from "./env"
import { protectedRoutes, routes } from "./web/routes"
import { authTokenName } from "./web/utils/def/constants"
import { locales, routing } from "@client/i18n/routing"

const middlewareI18n = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const response = middlewareI18n(request)

  const defaultLocale = request.headers.get("x-locale") || "en"
  response.headers.set("x-locale", defaultLocale)

  const localeRegex = new RegExp(`^/(${locales.join("|")})`)
  const pathnameWithoutLocale = request.nextUrl.pathname.replace(
    localeRegex,
    ""
  )

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  )

  const authToken = request.cookies.get(authTokenName)?.value

  if (isProtectedRoute) {
    if (!authToken) {
      return NextResponse.redirect(new URL(routes.home, request.url))
    }

    try {
      const authResponse = await fetch(
        env.NEXT_PUBLIC_MIDDLEWARE_API_URL + routes.api.users.me,
        {
          method: "GET",
          headers: {
            Cookie: `${authTokenName}=${authToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )

      if (!authResponse.ok) {
        const redirectResponse = NextResponse.redirect(
          new URL(routes.home, request.url)
        )

        if (
          authResponse.status === SC.serverErrors.INTERNAL_SERVER_ERROR &&
          authToken
        ) {
          redirectResponse.cookies.delete(authTokenName)
        }

        return redirectResponse
      }

      return response
    } catch {
      return NextResponse.redirect(new URL(routes.home, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/hunts/:path*",
    "/profile/:path*",
  ],
}
