import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

export const locales = ["en", "fr"] as const

export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales: locales,
  defaultLocale: "en",
  localePrefix: "always",
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
