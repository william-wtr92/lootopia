/* eslint-disable complexity */
import { zodResolver } from "@hookform/resolvers/zod"
import { chestSchema, type ChestSchema } from "@lootopia/common"
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
} from "@lootopia/ui"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { v4 as uuid } from "uuid"

type ChestFormProps = {
  initialData?: Partial<ChestSchema> | null
  onSubmit: (data: ChestSchema) => void
}

const ChestForm = ({ initialData, onSubmit }: ChestFormProps) => {
  const t = useTranslations("Components.Hunts.Form.ChestForm")

  const form = useForm<ChestSchema>({
    resolver: zodResolver(chestSchema),
    mode: "onBlur",
    defaultValues: {
      id: initialData?.id || uuid(),
      position: initialData?.position || { lat: 0, lng: 0 },
      description: initialData?.description || "",
      reward: initialData?.reward || "",
      size: initialData?.size || 80,
      maxUsers: initialData?.maxUsers || 1,
      visibility: initialData?.visibility || false,
    },
  })

  const {
    formState: { errors },
  } = form

  const handleSubmit = (data: ChestSchema) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description.label")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t("description.placeholder")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("reward.label")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("reward.placeholder")} />
              </FormControl>
              <FormMessage className="text-error">
                {errors.reward ? t("reward.error") : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("size.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={1}
                  max={100}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value) || 80)}
                />
              </FormControl>
              <FormDescription>{t("size.description")}</FormDescription>
              <FormMessage className="text-error">
                {errors.size ? t("size.error") : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxUsers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("maxUsers.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={1}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {t("visibility.label")}
                </FormLabel>
                <FormDescription>{t("visibility.description")}</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          disabled={!form.formState.isValid}
          type="submit"
          className="text-primary bg-accent hover:bg-accent-hover w-full"
        >
          {t("submit")}
        </Button>
      </form>
    </Form>
  )
}

export default ChestForm
