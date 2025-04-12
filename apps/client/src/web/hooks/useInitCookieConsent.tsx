"use client"

import { useEffect } from "react"

import { useCookieConsentStore } from "@client/web/store/useCookieConsentStore"

export const useInitCookieConsent = () => {
  const setIsVisible = useCookieConsentStore((state) => state.setIsVisible)

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookie-consent")

    if (!storedConsent) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [setIsVisible])
}
