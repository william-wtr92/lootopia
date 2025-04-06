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
import ReactivateAccountRequestForm from "@client/web/components/features/users/login/ReactivateAccountRequestForm"
import { routes } from "@client/web/routes"
import { login } from "@client/web/services/auth/login"
import { useAuthStore } from "@client/web/store/useAuthStore"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

const LoginPage = () => {
  const router = useRouter()
  const t = useTranslations("Pages.Auth.Login")
  const { toast } = useToast()
  const { setAuthToken } = useAuthStore()

  const qc = useQueryClient()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {
    formState: { errors },
  } = form

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true)
    const [status, key] = await login(data)
    setIsLoading(false)

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
                    <FormLabel className="text-primary flex items-center justify-between gap-2">
                      <span>{t("form.password.label")}</span>
                      <Link href={routes.auth.requestPasswordReset}>
                        <span className="text-secondary">
                          {t("form.password.forgotten")}
                        </span>
                      </Link>
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
                disabled={isLoading || !form.formState.isValid}
                type="submit"
                className="text-primary bg-accent hover:bg-accent-hover w-full"
              >
                {isLoading ? t("form.loading") : t("form.submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-primary flex flex-col items-center space-y-2 text-sm">
          <div className="flex gap-1">
            {t("cta.title")}
            <Link href={routes.auth.register}>
              <span className="text-secondary hover:font-semibold">
                {t("cta.register")}
              </span>
            </Link>
          </div>

          <div>
            <ReactivateAccountRequestForm />
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}

export default LoginPage
