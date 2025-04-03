/* eslint-disable complexity */
import { zodResolver } from "@hookform/resolvers/zod"
import {
  cities,
  type HuntSchema,
  huntSchema,
  OTHER_CITY_OPTION,
} from "@lootopia/common"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
  Textarea,
  Switch,
  Input,
  FormLabel,
  DatePicker,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@lootopia/ui"
import { useTranslations } from "next-intl"
import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"

import { useHuntStore } from "@client/web/store/useHuntStore"
import { capitalizeFirstLetter } from "@client/web/utils/capitalizeFirstLetter"

type Props = {
  onSubmit: (data: HuntSchema) => void
  mode?: "draft" | "update"
  updateHunt?: HuntSchema
}

const HuntForm = ({ onSubmit, mode = "draft", updateHunt }: Props) => {
  const t = useTranslations("Components.Hunts.Form.HuntForm")
  const { activeHuntId, hunts } = useHuntStore()

  const activeHunt = useCallback(() => {
    if (activeHuntId && mode === "draft") {
      return hunts[activeHuntId]?.hunt
    }

    return {
      ...updateHunt,
      city:
        updateHunt?.city !== OTHER_CITY_OPTION
          ? capitalizeFirstLetter(updateHunt?.city ?? "")
          : updateHunt?.city,
    }
  }, [activeHuntId, mode, hunts, updateHunt])

  const form = useForm<HuntSchema>({
    resolver: zodResolver(huntSchema),
    mode: "onBlur",
    defaultValues: {
      name: activeHunt()?.name ?? "",
      description: activeHunt()?.description ?? "",
      city: activeHunt()?.city ?? "",
      startDate: activeHunt()?.startDate ?? "",
      endDate: activeHunt()?.endDate ?? "",
      maxParticipants: activeHunt()?.maxParticipants ?? undefined,
      mode: activeHunt()?.mode ?? true,
    },
  })

  const {
    formState: { errors },
  } = form

  useEffect(() => {
    if (activeHunt) {
      form.reset(activeHunt())
    }
  }, [activeHunt, form])

  const today = new Date(new Date().setHours(0, 0, 0, 0))

  const handleResetEndDate = () => {
    form.setValue("endDate", "")
  }

  const handleChangeMinEndDate = () => {
    return form.watch("startDate")
      ? new Date(form.watch("startDate"))
      : new Date()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="text-primary flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("name.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("name.placeholder")}
                  className="border-primary border"
                />
              </FormControl>
              <FormMessage className="text-error">
                {errors.name ? t("name.error") : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("description.label")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t("description.placeholder")}
                  className="border-primary h-10 border"
                />
              </FormControl>
              <FormMessage className="text-error">
                {errors.description ? t("description.error") : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("city.label")}</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(v) => v !== "" && field.onChange(v)}
                  value={field.value}
                >
                  <SelectTrigger className="border-primary border">
                    <SelectValue placeholder={t("city.placeholder")} />
                  </SelectTrigger>
                  <SelectContent className="bg-primaryBg text-primary">
                    {cities.map((city, index) => (
                      <SelectItem
                        key={`city-${index}-${city.name}`}
                        value={city.name}
                      >
                        {city.name}
                      </SelectItem>
                    ))}
                    <SelectItem
                      key={`city-${OTHER_CITY_OPTION}`}
                      className="font-semibold"
                      value={OTHER_CITY_OPTION}
                    >
                      {t("city.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-error">
                {errors.city ? t("city.error") : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("startDate.label")}</FormLabel>
              <FormControl>
                <DatePicker
                  placeholder={t("startDate.placeholder")}
                  className="text-primary border-primary bg-primaryBg w-full"
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(selectedDate) => {
                    field.onChange(selectedDate || "")
                    handleResetEndDate()
                  }}
                  minDate={today}
                />
              </FormControl>
              <FormMessage className="text-error">
                {errors.startDate ? t("startDate.error") : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("endDate.label")}</FormLabel>
              <FormControl>
                <DatePicker
                  placeholder={t("endDate.placeholder")}
                  className="text-primary border-primary bg-primaryBg w-full"
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(selectedDate) => {
                    field.onChange(selectedDate || "")
                  }}
                  minDate={handleChangeMinEndDate()}
                />
              </FormControl>
              <FormMessage className="text-error">
                {errors.endDate ? t("endDate.error") : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("maxParticipants.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder={t("maxParticipants.placeholder")}
                  className="border-primary border"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value
                    field.onChange(
                      val === "" ? undefined : Math.max(0, Number(val))
                    )
                  }}
                />
              </FormControl>
              <FormMessage className="text-error">
                {errors.maxParticipants ? t("maxParticipants.error") : null}
              </FormMessage>
              <FormDescription className="flex gap-1 text-sm text-gray-500">
                <span>{t("maxParticipants.description")}</span>
                <span>{t("maxParticipants.bold")}</span>
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem className="border-primary flex w-full items-center justify-between rounded-lg border p-4 shadow-md">
              <FormDescription className="text-md flex gap-1">
                <span>{t("mode.description")}</span>
                <span>
                  {field.value ? t("mode.public") : t("mode.private")}
                </span>
              </FormDescription>
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
          className="text-primary bg-accent hover:bg-accentHover w-full"
        >
          <span>
            {activeHuntId && mode === "draft"
              ? t("submit.update")
              : mode === "update"
                ? t("submit.update")
                : t("submit.create")}
          </span>
        </Button>
      </form>
    </Form>
  )
}

export default HuntForm
