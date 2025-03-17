"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  type ResendEmailValidationSchema,
  resendEmailValidationSchema,
} from "@lootopia/common"
import {
  Button,
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
  useToast,
} from "@lootopia/ui"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { routes } from "@client/web/routes"
import { resendEmailValidation } from "@client/web/services/auth/resendEmailValidation"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

const ResendEmailValidationPage = () => {
  const t = useTranslations("Pages.Auth.ResendEmailValidation")
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<ResendEmailValidationSchema>({
    resolver: zodResolver(resendEmailValidationSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  })

  const {
    formState: { errors },
  } = form

  const onSubmit = async (data: ResendEmailValidationSchema) => {
    const [status, key] = await resendEmailValidation(data)

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

    router.push(routes.home)
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
              className="flex flex-col justify-center space-y-6 text-black"
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

export default ResendEmailValidationPage
