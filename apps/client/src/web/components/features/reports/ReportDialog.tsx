"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  ACCEPTED_ATTATCHMENT_FILE_TYPES,
  reportReasons,
  reportSchema,
  type ReportSchema,
} from "@lootopia/common"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Input,
  Textarea,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  AlertDialogContent,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogTrigger,
  useToast,
} from "@lootopia/ui"
import { AlertTriangle, Flag, Upload } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { reportUpload } from "@client/web/services/reports/reportUpload"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  userNickname: string
}

const ReportDialog = ({ userNickname }: Props) => {
  const t = useTranslations("Components.Users.ReportDialog")
  const { toast } = useToast()

  const [attachment, setAttachment] = useState<string | null>(null)

  const form = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    mode: "onBlur",
    defaultValues: {
      reason: undefined,
      description: "",
      attachment: undefined,
      reportedNickname: userNickname,
    },
  })

  const { errors } = form.formState

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      form.setValue("attachment", file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onloadend = () => {
        setAttachment(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ReportSchema) => {
    const [status, key] = await reportUpload(data)

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

    form.reset()
    setAttachment(null)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="hover:border-accent border-white text-white"
        >
          <Flag className="mr-2 h-4 w-4" />
          {t("trigger")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-primary bg-primaryBg sm:max-w-[500px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 text-black"
          >
            <AlertDialogHeader className="text-primary">
              <AlertDialogTitle className="text-primary flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                {t("form.title", {
                  nickname: userNickname,
                })}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("form.subtitle")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="border-primary text-primary">
                        <SelectValue
                          placeholder={t("form.reason.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent className="border-primary text-primary bg-primaryBg">
                        {Object.entries(reportReasons).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {t(`form.reason.options.${value}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-error">
                    {errors.reason ? t("form.reason.error") : null}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.description.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("form.description.placeholder")}
                      className="border-primary min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage className="text-error">
                    {errors.description ? t("form.description.error") : null}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">
                    {t("form.attachment.label")}
                  </FormLabel>
                  <FormControl>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Input
                          id="attachment"
                          type="file"
                          className="border-primary hidden"
                          accept={Object.values(
                            ACCEPTED_ATTATCHMENT_FILE_TYPES
                          ).join(",")}
                          onChange={(e) => {
                            handleAttachmentChange(e)
                            field.onChange(e.target.files?.[0])
                          }}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary hover:text-accent w-full"
                          onClick={() =>
                            document.getElementById("attachment")?.click()
                          }
                        >
                          <Upload className="mr-2 h-4 w-4" />
                        </Button>

                        {attachment && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              setAttachment(null)
                              field.onChange(undefined)
                            }}
                          >
                            {t("form.attachment.remove")}
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-[#8A4FFF]">
                        {t("form.attachment.acceptedExtensions")}
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage className="text-error">
                    {errors.attachment ? t("form.attachment.error") : null}
                  </FormMessage>
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>{t("form.cta.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-error text-white"
                disabled={!form.formState.isValid}
              >
                {t("form.cta.submit")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ReportDialog
