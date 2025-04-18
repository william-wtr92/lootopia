"use client"

import { stripeReturnUrlParams } from "@lootopia/common"
import { Button } from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import { Crown } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Link } from "@client/i18n/routing"
import ThankYouPopup from "@client/web/components/features/shop/ThankYouPopup"
import { routes } from "@client/web/routes"
import { getSessionIdDetails } from "@client/web/services/shop/getSessionIdDetails"

const ReturnPage = () => {
  const t = useTranslations("Pages.Shop.Return")
  const searchParams = useSearchParams()

  const [showThankYou, setShowThankYou] = useState(false)

  const { data: sessionIdDetails } = useQuery({
    queryKey: ["sessionIdDetails"],
    queryFn: () =>
      getSessionIdDetails({
        sessionId: searchParams.get(stripeReturnUrlParams.sessionId) || "",
      }),
    enabled: !!searchParams.get(stripeReturnUrlParams.sessionId),
  })

  const handleTriggerThankYou = () => {
    setShowThankYou((prev) => !prev)
  }

  useEffect(() => {
    const success = searchParams.get(stripeReturnUrlParams.success)

    if (success === "true") {
      handleTriggerThankYou()
    }
  }, [searchParams])

  return (
    <main className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-primary mb-6 text-4xl font-bold">{t("title")}</h1>

        <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <div className="mb-6 flex justify-center">
            <div className="bg-primary flex h-20 w-20 items-center justify-center rounded-full">
              <Crown className="text-accent h-10 w-10" />
            </div>
          </div>

          <p className="text-primary mb-6 text-lg">{t("description")}</p>

          <Button className="bg-primary text-accent hover:bg-secondary">
            <Link href={routes.home}>{t("cta.home")}</Link>
          </Button>
        </div>

        {sessionIdDetails?.result && (
          <ThankYouPopup
            isOpen={showThankYou}
            onClose={handleTriggerThankYou}
            crownPackage={sessionIdDetails.result}
          />
        )}
      </div>
    </main>
  )
}

export default ReturnPage
