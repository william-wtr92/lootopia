"use client"

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useToast,
} from "@lootopia/ui"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"

import { Link } from "@client/i18n/routing"
import { translateDynamicKey } from "@client/utils/helpers/translateDynamicKey"
import { routes } from "@client/utils/routes"
import { emailValidation } from "@client/web/services/auth/emailValidation"

const EmailValidationPage = () => {
  const t = useTranslations("Pages.Auth.EmailValidation")
  const { toast } = useToast()
  const router = useRouter()

  const [token] = useQueryState("token")

  const handleValidation = async () => {
    if (!token) {
      return
    }

    const [status, key] = await emailValidation({ token })

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${key}`),
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
    <main className="relative flex flex-1 items-center justify-center">
      <Card className="text-primary border-primary bg-primaryBg z-0 flex h-72 w-2/5 flex-col items-center justify-center gap-6 opacity-95">
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            <h1>{t("title")}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-8">
          <p className="text-center">{t("description")}</p>
          <Button
            className="text-primary bg-accent hover:bg-accentHover w-full"
            disabled={!token}
            onClick={handleValidation}
          >
            {t("cta.validate")}
          </Button>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>{t("cta.resend.label")}</span>
            <Link href={routes.auth.resendEmaiValidation}>
              <span className="text-secondary">{t("cta.resend.link")}</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default EmailValidationPage
