"use client"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  useToast,
} from "@lootopia/ui"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"

import { routes } from "@client/web/routes"
import { reactivateAccountConfirm } from "@client/web/services/auth/reactivateAccountConfirm"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

const ConfirmReactivationPage = () => {
  const t = useTranslations("Pages.Auth.ConfirmReactivateAccount")

  const router = useRouter()
  const { toast } = useToast()
  const [token] = useQueryState("token")

  const handleConfirm = async () => {
    if (!token) {
      toast({
        variant: "destructive",
        description: t("errors.tokenNotFound"),
      })

      return
    }

    const [status, keys] = await reactivateAccountConfirm({ token })

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

    router.push(routes.auth.login)
  }

  return (
    <main className="relative flex flex-1 items-center justify-center">
      <Card className="text-primary flex h-fit w-2/5 flex-col items-center justify-start">
        <CardHeader>
          <CardTitle className="text-center text-3xl">{t("title")}</CardTitle>
          <CardDescription className="text-cente text-md">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <Button
            className="text-primary bg-accent hover:bg-accentHover w-full"
            disabled={!token}
            onClick={handleConfirm}
          >
            {t("cta.confirm")}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default ConfirmReactivationPage
