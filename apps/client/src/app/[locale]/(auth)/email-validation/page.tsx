"use client"

import { Button, Card, toast } from "@lootopia/ui"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"

import { translateDynamicKey } from "@client/utils/helpers/translateDynamicKey"
import { routes } from "@client/utils/routes"
import { emailValidation } from "@client/web/services/auth/emailValidation"

const EmailValidationPage = () => {
  const t = useTranslations("Pages.Auth.EmailValidation")
  const router = useRouter()

  const [token] = useQueryState("token")

  const handleValidation = async () => {
    if (!token) {
      return
    }

    const [status, keys] = await emailValidation({ token })

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${keys}`),
      })

      return
    }

    toast({
      variant: "default",
      description: t("success"),
    })

    router.push(routes.home)
  }

  return (
    <div className="relative flex h-[75vh] items-center justify-center overflow-hidden">
      <Card className="text-primary border-primary bg-primaryBg z-0 flex h-72 w-2/5 flex-col items-center justify-center gap-10 opacity-95">
        <h1 className="text-center text-3xl">{t("title")}</h1>
        <p className="text-center">{t("description")}</p>
        <Button
          className="text-white"
          disabled={!token}
          onClick={handleValidation}
        >
          {t("cta.validate")}
        </Button>
      </Card>
    </div>
  )
}

export default EmailValidationPage
