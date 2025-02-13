import { NextResponse, type NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { env } from "./env"
import { authEndpoint, authTokenName } from "./utils/def/constants"
import { protectedRoutes, routes } from "./utils/routes"
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
        env.NEXT_PUBLIC_MIDDLEWARE_API_URL + authEndpoint,
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
        return NextResponse.redirect(new URL(routes.home, request.url))
      }

      return response
    } catch {
      return NextResponse.redirect(new URL(routes.home, request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/hunts/:path*"],
}

// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { createI18nMiddleware } from "next-intl/server"

// // Configuration de next-intl
// const i18nMiddleware = createI18nMiddleware({
//   locales: ["en", "fr"], // Vos locales configurées
//   defaultLocale: "fr",
// })

// export async function middleware(request: NextRequest) {
//   // Étape 1 : Gérer la localisation avec next-intl
//   const i18nResponse = i18nMiddleware(request)

//   // Étape 2 : Récupérer le token depuis les cookies
//   const token = request.cookies.get("auth-token")?.value

//   // Routes à protéger
//   const protectedRoutes = ["/hunts", "/dashboard", "/profile"]

//   const isProtectedRoute = protectedRoutes.some((route) =>
//     request.nextUrl.pathname.startsWith(route)
//   )

//   // Étape 3 : Vérification du token pour les routes protégées
//   if (isProtectedRoute) {
//     if (!token) {
//       // Pas de token, redirection vers la page de login
//       return NextResponse.redirect(new URL("/login", request.url))
//     }

//     try {
//       // Vérification du token auprès de votre endpoint d'authentification
//       const authResponse = await fetch("http://localhost:3001/auth/me", {
//         method: "GET",
//         headers: {
//           Cookie: `auth-token=${token}`,
//           "Content-Type": "application/json",
//         },
//         // Important : garder les credentials pour les cookies
//         credentials: "include",
//       })

//       // Si la vérification échoue
//       if (!authResponse.ok) {
//         // Token invalide, redirection vers le login
//         return NextResponse.redirect(new URL("/login", request.url))
//       }

//       // Token valide, continuer la requête
//       return i18nResponse
//     } catch (error) {
//       // Erreur de requête, redirection vers le login
//       console.error("Authentication check failed:", error)
//       return NextResponse.redirect(new URL("/login", request.url))
//     }
//   }

//   // Pour les routes non protégées, continuer normalement
//   return i18nResponse
// }

// // Configuration des routes à surveiller
// export const config = {
//   matcher: [
//     // next-intl routes
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",

//     // Routes protégées spécifiques
//     "/hunts/:path*",
//     "/dashboard/:path*",
//     "/profile/:path*",
//   ],
// }
