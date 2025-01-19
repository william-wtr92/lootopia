"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterSchema } from "@lootopia/common"
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  DatePicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  useToast,
} from "@lootopia/ui"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import {
  checkPasswordStrength,
  type PasswordStrength,
} from "@client/utils/helpers/passwordChecker"
import { routes } from "@client/utils/routes"
import CustomLink from "@client/web/components/utils/CustomLink"
import PasswordStrengthChecker from "@client/web/components/utils/form/PasswordStrengthChecker"
import { register } from "@client/web/services/auth/register"

const RegisterPage = () => {
  const t = useTranslations("Pages.Auth.Register")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
  })
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      avatar: undefined,
      nickname: "",
      email: "",
      phone: "",
      birthdate: "",
      password: "",
      confirmPassword: "",
      gdprValidated: false,
    },
  })

  const {
    formState: { errors },
  } = form

  const onSubmit = async (data: RegisterSchema) => {
    const body = { ...data, avatar: form.getValues("avatar") || undefined }

    await register(body)

    toast({
      variant: "default",
      description: t("success"),
    })

    router.push(routes.home)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      form.setValue("avatar", file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
              <div className="flex flex-col items-center space-y-2">
                <div
                  className="bg-secondary flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full"
                  onClick={handleAvatarClick}
                >
                  {avatar ? (
                    <Image src={avatar} alt="Avatar" width={96} height={96} />
                  ) : (
                    <span className="text-primaryBg text-4xl">+</span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                />
                <Label className="text-primary">{t("form.avatar.label")}</Label>
              </div>

              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {t("form.nickname.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-primary focus:ring-secondary"
                        autoComplete="nickname"
                      />
                    </FormControl>
                    <FormMessage className="text-error">
                      {errors.nickname ? t("form.nickname.error") : null}
                    </FormMessage>
                  </FormItem>
                )}
              />

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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {t("form.phone.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        className="border-primary focus:ring-secondary"
                      />
                    </FormControl>
                    <FormMessage className="text-error">
                      {errors.phone ? t("form.phone.error") : null}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-primary">
                      {t("form.birthdate.label")}
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        placeholder={t("form.birthdate.placeholder")}
                        className="text-primary border-primary bg-primaryBg w-full"
                        onChange={(selectedDate) => {
                          field.onChange(selectedDate?.toISOString() || "")
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-error">
                      {errors.birthdate ? t("form.birthdate.error") : null}
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
                          onFocus={handlePasswordFocus}
                          onBlur={handlePasswordBlur}
                          autoComplete="new-password"
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

              <FormField
                control={form.control}
                name="gdprValidated"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-primary data-[state=checked]:border-secondary data-[state=checked]:bg-secondary text-white"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-primary text-sm">
                        {t("form.gdpr.label")}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                disabled={!form.formState.isValid}
                type="submit"
                className="text-primary w-full bg-[#FFD700] hover:bg-[#E6C200]"
              >
                {t("form.submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-primary flex justify-center text-sm">
          <div>
            {t("cta.title")}{" "}
            <CustomLink href={routes.home}>
              <span className="text-secondary">{t("cta.login")}</span>
            </CustomLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RegisterPage
