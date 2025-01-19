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
import { AnimatePresence } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import {
  checkPasswordStrength,
  type PasswordStrength,
} from "@client/utils/helpers/passwordChecker"
import { routes } from "@client/utils/routes"
import CustomLink from "@client/web/components/utils/CustomLink"
import PasswordCheckItem from "@client/web/components/utils/PasswordCheckItem"
import { register } from "@client/web/services/auth/register"

const RegisterPage = () => {
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

  const onSubmit = async (data: RegisterSchema) => {
    const body = { ...data, avatar: form.getValues("avatar") || undefined }

    await register(body)

    toast({
      variant: "default",
      description: "Votre compte a été créé avec succès.",
    })

    router.push(routes.home)
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

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "password") {
        setPasswordStrength(checkPasswordStrength(value.password || ""))
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  return (
    <div className="overflow-hidden] relative flex min-h-screen items-center justify-center">
      <Card className="border-primary bg-primaryBg z-0 w-2/5 opacity-95">
        <CardHeader className="text-center">
          <CardTitle className="text-primary text-3xl font-bold">
            Créer un compte
          </CardTitle>
          <CardTitle className="text-md text-primary font-normal">
            Commencez votre aventure dès maintenant !
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
                  onClick={() => fileInputRef.current?.click()}
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
                  accept="image/*"
                />
                <Label className="text-primary">Avatar</Label>
              </div>

              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Pseudo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-primary focus:ring-secondary"
                        autoComplete="nickname"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="border-primary focus:ring-secondary"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        className="border-primary focus:ring-secondary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-primary">
                      Date de naissance
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        placeholder="Choisissez une date"
                        className="text-primary border-primary bg-primaryBg w-full"
                        onChange={(selectedDate) => {
                          field.onChange(selectedDate?.toISOString() || "")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                // eslint-disable-next-line complexity
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Mot de passe</FormLabel>
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
                      <button
                        type="button"
                        className="text-primary hover:text-secondary absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                    {isPasswordFocused && (
                      <div className="mt-2 space-y-1">
                        <AnimatePresence>
                          {!passwordStrength.hasUppercase && (
                            <PasswordCheckItem
                              key="uppercase"
                              label="Au moins une majuscule"
                              isValid={passwordStrength.hasUppercase}
                            />
                          )}
                          {!passwordStrength.hasLowercase && (
                            <PasswordCheckItem
                              key="lowercase"
                              label="Au moins une minuscule"
                              isValid={passwordStrength.hasLowercase}
                            />
                          )}
                          {!passwordStrength.hasNumber && (
                            <PasswordCheckItem
                              key="number"
                              label="Au moins un chiffre"
                              isValid={passwordStrength.hasNumber}
                            />
                          )}
                          {!passwordStrength.hasSpecialChar && (
                            <PasswordCheckItem
                              key="special"
                              label="Au moins un caractère spécial"
                              isValid={passwordStrength.hasSpecialChar}
                            />
                          )}
                          {!passwordStrength.isLongEnough && (
                            <PasswordCheckItem
                              key="length"
                              label="Au moins 12 caractères"
                              isValid={passwordStrength.isLongEnough}
                            />
                          )}
                        </AnimatePresence>
                      </div>
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
                      Confirmer le mot de passe
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="border-primary focus:ring-secondary"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
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
                        J'accepte les conditions d'utilisation et la politique
                        de confidentialité
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
                S'inscrire
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-primary flex justify-center text-sm">
          <div>
            Déjà un compte ?{" "}
            <CustomLink href={routes.home}>
              <span className="text-secondary">Connectez-vous</span>
            </CustomLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RegisterPage
