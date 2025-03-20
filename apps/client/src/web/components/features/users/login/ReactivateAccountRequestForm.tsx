import { zodResolver } from "@hookform/resolvers/zod"
import {
  reactivateAccountRequestSchema,
  type ReactivateAccountRequestSchema,
} from "@lootopia/common"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  Input,
  useToast,
  DialogClose,
} from "@lootopia/ui"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { reactivateAccountRequest } from "@client/web/services/auth/reactivateAccountRequest"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

const ReactivateAccountRequestForm = () => {
  const t = useTranslations("Components.Users.ReactivateAccountRequestForm")
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<ReactivateAccountRequestSchema>({
    resolver: zodResolver(reactivateAccountRequestSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  })

  const {
    formState: { errors },
  } = form

  const onSubmit = async (data: ReactivateAccountRequestSchema) => {
    const [status, key] = await reactivateAccountRequest(data)

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

    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex items-center gap-1" asChild>
        <div>
          <span>{t("label")}</span>
          <span className="text-secondary cursor-pointer hover:font-semibold">
            {t("trigger")}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary text-center font-bold">
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Form {...form}>
            <form className="space-y-6 text-black">
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
            </form>
          </Form>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">{t("cta.cancel")}</Button>
          </DialogClose>

          <Button
            type="submit"
            disabled={!form.formState.isValid}
            onClick={form.handleSubmit(onSubmit)}
          >
            {t("cta.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReactivateAccountRequestForm
