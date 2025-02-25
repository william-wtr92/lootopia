"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { passwordResetSchema, type PasswordResetSchema } from "@lootopia/common"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  useToast,
} from "@lootopia/ui"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import {
  checkPasswordStrength,
  type PasswordStrength,
} from "@client/utils/helpers/passwordChecker"
import { translateDynamicKey } from "@client/utils/helpers/translateDynamicKey"
import { routes } from "@client/utils/routes"
import PasswordStrengthChecker from "@client/web/components/utils/form/PasswordStrengthChecker"
import { passwordReset } from "@client/web/services/auth/passwordReset"

const PasswordResetPage = () => {
  const router = useRouter()
  const [token] = useQueryState("token")
  const { toast } = useToast()
  const t = useTranslations("Pages.Auth.PasswordReset")

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
  })
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<PasswordResetSchema>({
    resolver: zodResolver(passwordResetSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token || "",
    },
  })

  const {
    formState: { errors },
  } = form

  const onSubmit = async (data: PasswordResetSchema) => {
    const [status, key] = await passwordReset(data)

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

    router.push(routes.auth.login)
  }

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true)
  }

  const handlePasswordBlur = useCallback(() => {
    if (!form.getValues("password")) {
      setIsPasswordFocused(false)
    }
  }, [form])

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "password") {
        setPasswordStrength(checkPasswordStrength(value.password || ""))
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  useEffect(() => {
    if (!token) {
      router.push(routes.home)
    }
  }, [router, token])

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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-center space-y-6 text-black"
            >
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
                          onFocus={handlePasswordFocus}
                          onBlur={handlePasswordBlur}
                          autoComplete="new-password"
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
                    <FormMessage />
                    {isPasswordFocused && (
                      <PasswordStrengthChecker
                        passwordStrength={passwordStrength}
                      />
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {t("form.confirmPassword.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="border-primary focus:ring-secondary"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage className="text-error">
                      {errors.confirmPassword
                        ? t("form.confirmPassword.error")
                        : null}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <Button
                className="text-primary bg-accent hover:bg-accentHover w-full"
                type="submit"
                disabled={!form.formState.isValid}
              >
                {t("form.submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}

export default PasswordResetPage
