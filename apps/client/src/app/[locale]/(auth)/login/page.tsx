"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@lootopia/ui"
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
import { useQueryClient } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Link } from "@client/i18n/routing"
import { translateDynamicKey } from "@client/utils/helpers/translateDynamicKey"
import { routes } from "@client/utils/routes"
import { login } from "@client/web/services/auth/login"
import { reactivateAccountRequest } from "@client/web/services/auth/reactivateAccountRequest"

const LoginPage = () => {
  const router = useRouter()
  const t = useTranslations("Pages.Auth.Login")
  const { toast } = useToast()

  const qc = useQueryClient()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [emailInput, setEmailInput] = useState("")


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

    qc.invalidateQueries({ queryKey: ["user"] })

    router.push(routes.home)
  }

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleReactivateAccount = async () => {
    if (!emailInput) {
      toast({
        variant: "destructive",
        description: t("reactiveChamp"),
      })
      return
    }
  
    setIsLoading(true)
  
    const [status, key] = await reactivateAccountRequest({ email: emailInput })
  
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
      description: translateDynamicKey(t, `reactivateEmail`),
    })
  
    setIsDialogOpen(false)
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

              <div className="flex flex-col gap-3">
                <Button
                  disabled={isLoading || !form.formState.isValid}
                  type="submit"
                  className="text-primary bg-accent hover:bg-accent-hover w-full"
                >
                  {isLoading ? t("form.loading") : t("form.submit")}
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" type="button" className="text-secondary">
                      {t("reactivateAccount")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-primary text-center font-bold" >{t("reactivateAccount")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">{t("reactivateAccountDescription")}</p>
                      <FormControl>
                      <Input
                        type="email"
                        className="border-primary text-primary focus:ring-secondary"
                        autoComplete="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                      />
                      </FormControl>
                    </div>
                    <DialogFooter className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        {t("cancel")}
                      </Button>
                      <Button onClick={handleReactivateAccount} disabled={isLoading} >
                        {isLoading ? t("form.loading") : t("confirm")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-primary flex justify-center text-sm">
          <div>
            {t("cta.title")}
            <Link href={routes.auth.register}>
              <span className="text-secondary"> {t("cta.register")}</span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}

export default LoginPage
