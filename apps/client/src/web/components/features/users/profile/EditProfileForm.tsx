/* eslint-disable complexity */
import { zodResolver } from "@hookform/resolvers/zod"
import { type Roles, type UpdateSchema, updateSchema } from "@lootopia/common"
import {
  Button,
  DatePicker,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Edit, Save } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useRef, useState, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"

import { config } from "@client/env"
import { translateDynamicKey } from "@client/utils/helpers/translateDynamicKey"
import { login } from "@client/web/services/auth/login"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import updateUser from "@client/web/services/users/updateUser"

type AvatarType = string | File | undefined

type Props = {
  user: {
    id: string
    email: string
    nickname: string
    birthdate: string
    phone: string
    avatar: string | null
    role: Roles
  }
}

const EditProfileForm = (props: Props) => {
  const { user } = props

  const t = useTranslations("Pages.Users.Profile")
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserLoggedIn(),
  })

  const form = useForm<UpdateSchema>({
    resolver: zodResolver(updateSchema),
    mode: "onBlur",
    defaultValues: {
      avatar: user?.avatar as AvatarType,
      nickname: user?.nickname,
      email: user?.email,
      phone: user?.phone,
      birthdate: user?.birthdate,
      password: "",
      confirmPassword: "",
    },
  })
  const { errors } = form.formState

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<string | null>(user?.avatar)
  const [password, setPassword] = useState<string>("")
  const [showPasswordValidationStep, setShowPasswordValidationStep] =
    useState<boolean>(false)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleIsOpen = (open: boolean) => {
    setIsOpen(open)
    handleShowPasswordValidationStep(false)
  }

  const handlePassword = (value: string) => {
    setPassword(value)
  }

  const handleShowPasswordValidationStep = (value: boolean) => {
    setShowPasswordValidationStep(value)
  }

  const validatePassword = async () => {
    const body = {
      email: user?.email,
      password: password,
    }

    const [status, key] = await login(body)

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${key}`),
      })

      return false
    }

    return true
  }

  const onSubmit = async (data: UpdateSchema) => {
    if (!showPasswordValidationStep) {
      handleShowPasswordValidationStep(true)

      return
    }

    const isAuthorized = await validatePassword()

    if (!isAuthorized) {
      return
    }

    const [status, key] = await updateUser(data)

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

    handleIsOpen(false)
    refetch()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <Edit className="mr-2 h-4 w-4" />
          {t("cta.editProfile")}
        </Button>
      </DialogTrigger>

      <DialogContent className="text-primary" size="xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            {!showPasswordValidationStep
              ? t("editModal.title")
              : t("editModal.passwordValidationCheckTitle")}
          </DialogTitle>
          <Form {...form}>
            <form
              className="flex flex-col gap-3 pt-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {!showPasswordValidationStep ? (
                <>
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className="bg-secondary flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full"
                      onClick={handleAvatarClick}
                    >
                      {avatar ? (
                        <Image
                          src={config.blobUrl + avatar}
                          alt="Avatar"
                          width={96}
                          height={96}
                        />
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
                    <Label className="text-primary">
                      {t("editModal.avatar.label")}
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary">
                            {t("editModal.nickname.label")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-primary focus:ring-secondary"
                              autoComplete="nickname"
                            />
                          </FormControl>
                          <FormMessage className="text-error">
                            {errors.nickname
                              ? t("editModal.nickname.error")
                              : null}
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
                            {t("editModal.email.label")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-primary focus:ring-secondary"
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage className="text-error">
                            {errors.email ? t("editModal.email.error") : null}
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
                            {t("editModal.phone.label")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-primary focus:ring-secondary"
                              autoComplete="phone"
                            />
                          </FormControl>
                          <FormMessage className="text-error">
                            {errors.phone ? t("editModal.phone.error") : null}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthdate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary">
                            {t("editModal.birthdate.label")}
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              placeholder={t("editModal.birthdate.label")}
                              className="text-primary border-primary bg-primaryBg w-full"
                              onChange={(selectedDate) => {
                                field.onChange(selectedDate || "")
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-error">
                            {errors.birthdate
                              ? t("editModal.birthdate.error")
                              : null}
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
                            {t("editModal.password.label")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="border-primary focus:ring-secondary"
                              autoComplete="off"
                            />
                          </FormControl>
                          <FormMessage className="text-error">
                            {errors.password
                              ? t("editModal.password.error")
                              : null}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary">
                            {t("editModal.confirmPassword.label")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="border-primary focus:ring-secondary"
                              autoComplete="confirmPassword"
                            />
                          </FormControl>
                          <FormMessage className="text-error">
                            {errors.confirmPassword
                              ? t("editModal.confirmPassword.error")
                              : null}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    className="w-fit self-end"
                    variant="secondary"
                    type="submit"
                  >
                    <Save className="mr-2 h-4 w-4" /> {t("editModal.save")}
                  </Button>
                </>
              ) : (
                <>
                  <ArrowLeft
                    className="absolute left-4 top-4 cursor-pointer"
                    onClick={() => handleShowPasswordValidationStep(false)}
                  ></ArrowLeft>

                  <FormItem>
                    <FormLabel className="text-primary">
                      {t("editModal.password.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="border-primary focus:ring-secondary"
                        autoComplete="off"
                        onChange={(e) => handlePassword(e.target.value)}
                      />
                    </FormControl>
                  </FormItem>

                  <Button
                    className="w-fit self-center"
                    variant="secondary"
                    type="submit"
                  >
                    <Save className="mr-2 h-4 w-4" /> {t("editModal.confirm")}
                  </Button>
                </>
              )}
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileForm
