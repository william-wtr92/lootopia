"use client"

import { useTranslations } from "next-intl"

const Footer = () => {
  const t = useTranslations("Components.Utils.Layout.Footer")

  return (
    <footer className="bg-primary text-accent relative z-10 py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {t("content", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  )
}

export default Footer
