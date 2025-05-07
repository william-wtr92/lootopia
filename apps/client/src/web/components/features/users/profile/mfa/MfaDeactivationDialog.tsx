"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { mfaSchema, type MfaSchema } from "@lootopia/common"
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  useToast,
} from "@lootopia/ui"
import { useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, Loader2, ShieldX, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import MfaForm from "./MfaForm"
import { disableUserMfa } from "@client/web/services/users/disableUserMfa"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  open: boolean
  setIsOpen: (open: boolean) => void
}

const MfaDeactivationDialog = ({ open, setIsOpen }: Props) => {
  const t = useTranslations(
    "Components.Users.Profile.Mfa.MfaDeactivationDialog"
  )

  const { toast } = useToast()
  const qc = useQueryClient()

  const form = useForm<MfaSchema>({
    resolver: zodResolver(mfaSchema),
    mode: "onChange",
    defaultValues: {
      token: "",
    },
  })

  const handleVerify = async (data: MfaSchema) => {
    const [status, key] = await disableUserMfa(data)

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
  }

  const handleReset = () => {
    form.reset()
    setIsOpen(false)
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
      <DialogContent className="border-primary bg-primaryBg sm:max-w-md">
        <div className="border-primary/20 from-primary to-secondary flex items-center justify-between border-b bg-gradient-to-r px-4 py-3">
          <DialogTitle className="flex items-center text-white">
            <ShieldX className="text-accent mr-2 size-5" />
            {t("title")}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white ring-0 hover:bg-white/10 focus-visible:ring-0"
            onClick={() => handleReset()}
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="space-y-4 px-4 pb-4">
          <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
            <div className="text-sm text-amber-800">
              <p className="mb-1 font-medium">{t("alert.title")}</p>
              <p>{t("alert.description")}</p>
            </div>
          </div>

          <MfaForm
            form={form}
            onSubmit={handleVerify}
            cancelButton={
              <Button
                variant="outline"
                className="border-primary text-primary"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                {t("cta.cancel")}
              </Button>
            }
            submitButton={
              <Button
                variant="destructive"
                type="submit"
                disabled={!form.formState.isValid}
              >
                {form.formState.isLoading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  t("cta.submit")
                )}
              </Button>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MfaDeactivationDialog
