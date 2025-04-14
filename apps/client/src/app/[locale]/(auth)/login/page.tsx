"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginSchema } from "@lootopia/common"
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@lootopia/ui"
import { useQueryClient } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Link } from "@client/i18n/routing"
import MfaVerificationForm from "@client/web/components/features/users/profile/mfa/MfaVerificationForm"
import { routes } from "@client/web/routes"
import { login } from "@client/web/services/auth/login"
import { useAuthStore } from "@client/web/store/useAuthStore"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

const LoginPage = () => {
  const t = useTranslations("Pages.Auth.Login")

  const router = useRouter()
  const { toast } = useToast()
  const { setAuthToken } = useAuthStore()
  const qc = useQueryClient()

  const [showPassword, setShowPassword] = useState(false)
  const [showMfa, setShowMfa] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {
    formState: { errors },
  } = form

  const onSubmit = async (data: LoginSchema) => {
    const [status, result] = await login(data)

    if (!status) {
      const key = result as string

      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${key}`),
      })

      return
    }

    if (
      typeof result === "object" &&
      "mfaRequired" in result &&
      "sessionId" in result &&
      result.mfaRequired &&
      result.sessionId
    ) {
      setSessionId(result.sessionId)
      setShowMfa(true)

      return
    }

    toast({
      variant: "default",
      description: t("success"),
    })

    setAuthToken()

    qc.invalidateQueries({ queryKey: ["user"] })

    router.push(routes.home)
  }

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <main className="relative flex flex-1 items-center justify-center">
      <Card className="w-2/5">
        <CardHeader className="text-center">
          <CardTitle className="text-primary text-3xl font-bold">
            {t("title")}
          </CardTitle>
          <CardTitle className="text-md text-primary font-normal">
            {t("description")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showMfa ? (
            <MfaVerificationForm
              sessionId={sessionId!}
              setShowMfa={setShowMfa}
            />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 text-black"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        {t("form.email.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="border-primary focus:ring-secondary"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage className="text-error">
                        {errors.email ? t("form.email.error") : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        {t("form.password.label")}
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="border-primary focus:ring-secondary pr-10"
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-primary absolute inset-y-0 right-0 flex items-center pr-3 shadow-none hover:bg-transparent"
                          onClick={handleShowPassword}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  disabled={form.formState.isLoading || !form.formState.isValid}
                  type="submit"
                  className="text-primary bg-accent hover:bg-accent-hover w-full"
                >
                  {form.formState.isLoading
                    ? t("form.loading")
                    : t("form.submit")}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="text-primary flex flex-col items-center space-y-2 text-sm">
          <div className="flex gap-1">
            {t("cta.title")}
            <Link href={routes.auth.register}>
              <span className="text-secondary">{t("cta.register")}</span>
            </Link>
          </div>

          <div className="flex gap-1">
            Vous avez oublié votre mot de passe ?
            <Link href={routes.auth.requestPasswordReset}>
              <span className="text-secondary">
                Cliquez ici pour le réinitialiser
              </span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}

export default LoginPage
