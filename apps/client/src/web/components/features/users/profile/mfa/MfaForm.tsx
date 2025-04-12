import { type MfaSchema } from "@lootopia/common"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
} from "@lootopia/ui"
import { useTranslations } from "next-intl"
import type { UseFormReturn } from "react-hook-form"

import OtpDisplay from "./OtpDisplay"

type Props = {
  form: UseFormReturn<MfaSchema>
  onSubmit: (data: MfaSchema) => Promise<void>
  cancelButton?: React.ReactNode
  submitButton: React.ReactNode
}

const MfaForm = ({ form, onSubmit, cancelButton, submitButton }: Props) => {
  const t = useTranslations("Components.Users.Profile.Mfa.MfaForm")

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 pb-3"
      >
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                {t("form.token.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("form.token.placeholder")}
                  maxLength={6}
                  className="border-primary text-primary"
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "")

                    if (value.length <= 6) {
                      field.onChange(value)
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <OtpDisplay otp={form.watch("token")} />

        <div className="flex justify-end space-x-2">
          {cancelButton}
          {submitButton}
        </div>
      </form>
    </Form>
  )
}

export default MfaForm
