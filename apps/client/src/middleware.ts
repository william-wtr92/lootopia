import { NextResponse, type NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { env } from "./env"
import { authEndpoint, authTokenName } from "./utils/def/constants"
import { protectedRoutes, routes } from "./utils/routes"
import { locales, routing } from "@client/i18n/routing"

const middlewareI18n = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const response = middlewareI18n(request)

  const defaultLocale = request.headers.get("x-your-custom-locale") || "en"
  response.headers.set("x-your-custom-locale", defaultLocale)

  const localeRegex = new RegExp(`^/(${locales.join("|")})`)
  const pathnameWithoutLocale = request.nextUrl.pathname.replace(
    localeRegex,
    ""
  )

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  )

  if (isProtectedRoute) {
    const authToken = request.cookies.get(authTokenName)?.value

    if (!authToken) {
      return NextResponse.redirect(new URL(routes.home, request.nextUrl))
    }

    const test = await fetch(env.NEXT_PUBLIC_API_URL + authEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${authTokenName}=${authToken}`,
      },
      credentials: "include",
    })

    if (!test.ok) {
      return NextResponse.redirect(new URL(routes.home, request.nextUrl))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
