import { zodResolver } from "@hookform/resolvers/zod"
import { mfaSchema, type MfaSchema } from "@lootopia/common"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  useToast,
  InputOTPSeparator,
} from "@lootopia/ui"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { routes } from "@client/web/routes"
import { mfa } from "@client/web/services/auth/mfa"
import { useAuthStore } from "@client/web/store/useAuthStore"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  sessionId: string
  setShowMfa: (show: boolean) => void
}

const MfaVerificationForm = ({ sessionId, setShowMfa }: Props) => {
  const t = useTranslations("Components.Users.Profile.Mfa.MfaVerificationForm")

  const router = useRouter()
  const { toast } = useToast()
  const { setAuthToken } = useAuthStore()
  const qc = useQueryClient()

  const form = useForm<MfaSchema>({
    resolver: zodResolver(mfaSchema),
    mode: "onChange",
    defaultValues: {
      token: "",
    },
  })

  const handleSubmit = async (data: MfaSchema) => {
    const [status, key] = await mfa({
      token: data.token,
      sessionId: sessionId!,
    })

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

    setAuthToken()
    setShowMfa(false)
    qc.invalidateQueries({ queryKey: ["user"] })
    router.push(routes.home)
  }

  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center gap-6 pt-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="text-secondary size-6" />
          <h2 className="text-primary text-xl font-semibold">{t("title")}</h2>
        </div>

        <span className="text-secondary text-center text-sm">
          {t.rich("description", {
            br: () => <br />,
          })}
        </span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col items-center justify-center gap-10"
        >
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <InputOTP
                    {...field}
                    maxLength={6}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    onChange={(value) => {
                      const onlyNumbers = value.replace(/\D/g, "")
                      field.onChange(onlyNumbers)
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSeparator />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isLoading || !form.formState.isValid}
            type="submit"
            className="text-primary bg-accent hover:bg-accent-hover w-full"
          >
            {form.formState.isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              t("form.cta.verify")
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default MfaVerificationForm
