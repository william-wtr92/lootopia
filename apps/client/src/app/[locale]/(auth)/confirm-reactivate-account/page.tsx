"use client"

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useToast,
} from "@lootopia/ui"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"
import { useState, useEffect } from "react"

import { translateDynamicKey } from "@client/utils/helpers/translateDynamicKey"
import { reactivateAccountConfirm } from "@client/web/services/auth/reactivateAccountConfirm"

const ConfirmReactivationPage = () => {
  const t = useTranslations("Pages.ReactivateAccountConfirm")
  const { toast } = useToast()
  const [token] = useQueryState("token")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      toast({
        variant: "destructive",
        description: "Token manquant dans l'URL.",
      })
    }
  }, [token, toast])

  const handleConfirm = async () => {
    if (!token) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.tokenNotFound`),        
      })

      return
    }

    setLoading(true)
    await reactivateAccountConfirm({ token })
    setLoading(false)
  }

  return (
    <main className="relative flex flex-1 items-center justify-center">
      <Card className="text-primary flex h-fit w-2/5 flex-col items-center justify-start gap-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            Activation du Compte
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-8">
          <Button
            className="text-primary bg-accent hover:bg-accentHover w-full"
            disabled={!token || loading}
            onClick={handleConfirm}
          >
            {loading ? "Activation en cours..." : "Activer mon compte"}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default ConfirmReactivationPage
