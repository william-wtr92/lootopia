"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type MfaSchema, mfaSchema } from "@lootopia/common"
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  useToast,
} from "@lootopia/ui"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, ShieldCheck, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import QrCode from "react-qr-code"

import MfaForm from "./MfaForm"
import { getUserMfa } from "@client/web/services/users/getUserMfa"
import { verifyUserMfa } from "@client/web/services/users/verifyUserMfa"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  open: boolean
  setIsOpen: (open: boolean) => void
}

const MfaActivationDialog = ({ open, setIsOpen }: Props) => {
  const t = useTranslations("Components.Users.Profile.Mfa.MfaActivationDialog")
  const { toast } = useToast()
  const qc = useQueryClient()

  const { data } = useQuery({
    queryKey: ["mfa-enable"],
    queryFn: () => getUserMfa(),
    enabled: open,
    refetchOnWindowFocus: false,
  })

  const form = useForm<MfaSchema>({
    resolver: zodResolver(mfaSchema),
    mode: "onChange",
    defaultValues: {
      token: "",
    },
  })

  const [step, setStep] = useState<"qrcode" | "verify">("qrcode")

  const handleVerify = async (data: MfaSchema) => {
    const [status, key] = await verifyUserMfa(data)

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

    qc.invalidateQueries({ queryKey: ["user"] })

    setIsOpen(false)
    handleReset()
  }

  const handleSelectStep = (step: "qrcode" | "verify") => {
    setStep(step)
  }

  const handleReset = () => {
    handleSelectStep("qrcode")
    form.reset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleReset()
        }

        setIsOpen(newOpen)
      }}
    >
      <DialogContent className="bg-primaryBg border-primary sm:max-w-md">
        <div className="border-primary/20 from-primary to-secondary flex items-center justify-between border-b bg-gradient-to-r px-4 py-3">
          <DialogTitle className="flex items-center text-white">
            <ShieldCheck className="text-accent mr-2 size-5" />
            {t("title")}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white ring-0 hover:bg-white/10 focus-visible:ring-0"
            onClick={() => {
              setIsOpen(false)
              handleReset()
            }}
          >
            <X className="size-5" />
          </Button>
        </div>

        {step === "qrcode" ? (
          <div className="space-y-4 p-4">
            <div className="flex justify-center">
              <div className="border-primary relative rounded-lg border-4 bg-white p-2">
                {data && (
                  <div className="flex justify-center">
                    <div className="rounded-lg bg-white p-4">
                      <QrCode value={data} size={200} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-center">
              <p className="text-primary text-sm">{t("qrcode.info")}</p>
            </div>

            <Button
              className="bg-primary text-accent hover:bg-secondary w-full"
              onClick={() => handleSelectStep("verify")}
            >
              {t("qrcode.cta.continue")}
            </Button>
          </div>
        ) : (
          <MfaForm
            form={form}
            onSubmit={handleVerify}
            cancelButton={
              <Button
                variant="outline"
                className="border-primary text-primary"
                type="button"
                onClick={() => handleSelectStep("qrcode")}
              >
                {t("verify.cta.back")}
              </Button>
            }
            submitButton={
              <Button
                className="bg-primary text-accent hover:bg-secondary"
                type="submit"
                disabled={!form.formState.isValid}
              >
                {form.formState.isLoading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  t("verify.cta.activate")
                )}
              </Button>
            }
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default MfaActivationDialog
