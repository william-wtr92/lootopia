"use client"

import { useEffect } from "react"

import { usePathname } from "@client/i18n/routing"
import { routes } from "@client/web/routes"
import { useCookieConsentStore } from "@client/web/store/useCookieConsentStore"

export const useInitCookieConsent = () => {
  const pathname = usePathname()
  const setIsVisible = useCookieConsentStore((state) => state.setIsVisible)

  useEffect(() => {
    const isExcludedRoute = pathname?.startsWith(routes.artifacts.viewer)

    if (isExcludedRoute) {
      return
    }

    const storedConsent = localStorage.getItem("cookie-consent")

    if (!storedConsent) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [setIsVisible, pathname])
}
