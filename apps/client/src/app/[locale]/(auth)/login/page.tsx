"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginSchemaType } from "@lootopia/common"
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
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { translateDynamicKey } from "@client/utils/helpers/translateDynamicKey"
import { routes } from "@client/utils/routes"
import CustomLink from "@client/web/components/utils/CustomLink"
import { login } from "@client/web/services/auth/login"

const LoginPage = () => {
  const t = useTranslations("Pages.Auth.Login")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginSchemaType>({
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

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true)
    const [status, errorKey] = await login(data)
    setIsLoading(false)

    if (!status) {
      toast({
        variant: "default",
        description: translateDynamicKey(t, `errors.${errorKey}`),
      })

      return
    }

    toast({
      variant: "default",
      description: t("success"),
    })

    router.push(routes.home)
  }

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Card className="border-primary bg-primaryBg z-0 w-2/5 opacity-95">
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
                        className="text-primary hover:text-secondary absolute inset-y-0 right-0 flex items-center bg-transparent pr-3 shadow-none"
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
                {isLoading ? "Connexion..." : t("form.submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-primary flex justify-center text-sm">
          <div>
            {t("cta.title")}{" "}
            <CustomLink href={routes.register}>
              <span className="text-secondary">{t("cta.register")}</span>
            </CustomLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
