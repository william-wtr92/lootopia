import { zodResolver } from "@hookform/resolvers/zod"
import {
  type ArtifactUploadSchema,
  CHEST_REWARD_TYPES,
  type ChestRewardType,
  chestSchema,
  type ChestSchema,
  MAX_CROWN_REWARD,
  MAX_USERS_PER_CHEST,
} from "@lootopia/common"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
  useToast,
} from "@lootopia/ui"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuid } from "uuid"

import ArtifactPopover from "@client/web/components/features/artifacts/ArtifactPopover"
import { getArtifacts } from "@client/web/services/artifacts/getArtifacts"
import { uploadArtifact } from "@client/web/services/artifacts/uploadArtifact"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type ChestFormProps = {
  initialData?: Partial<ChestSchema> | null
  onSubmit: (data: ChestSchema) => void
}

const ChestForm = ({ initialData, onSubmit }: ChestFormProps) => {
  const t = useTranslations("Components.Hunts.Form.ChestForm")
  const { toast } = useToast()
  const qc = useQueryClient()

  const [rewardType, setRewardType] = useState<ChestRewardType>(
    initialData?.rewardType || "crown"
  )

  const { data: artifacts } = useQuery({
    queryKey: ["artifacts"],
    queryFn: getArtifacts,
  })

  const form = useForm<ChestSchema>({
    resolver: zodResolver(chestSchema),
    mode: "onBlur",
    defaultValues: {
      id: initialData?.id || uuid(),
      position: initialData?.position || { y: 0, x: 0 },
      description: initialData?.description || "",
      rewardType: initialData?.rewardType || rewardType,
      reward: initialData?.reward || "",
      size: initialData?.size || 80,
      maxUsers: initialData?.maxUsers || 1,
      visibility: initialData?.visibility || false,
    },
  })

  const {
    formState: { errors },
    setValue,
  } = form

  const handleSubmit = (data: ChestSchema) => {
    onSubmit(data)
  }

  const handleUploadArtifact = async (data: ArtifactUploadSchema) => {
    setValue("reward", data.file.name)

    const [status, key] = await uploadArtifact(data)

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${key}`),
      })

      return
    }

    qc.invalidateQueries({ queryKey: ["artifacts"], refetchType: "active" })

    toast({
      variant: "default",
      description: t("artifactCreated"),
    })
  }

  const handleRewardChange = (value: string) => {
    if (rewardType === "crown") {
      const numericValue = Number(value)
      setValue("reward", isNaN(numericValue) ? "" : numericValue, {
        shouldValidate: true,
      })

      return
    }

    setValue("reward", value, {
      shouldValidate: true,
    })
  }

  const handleSelectValue = (value: ChestRewardType) => {
    setRewardType(value)
    setValue("reward", "")
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
          name="rewardType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("rewardType.label")}</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value: ChestRewardType) => {
                  field.onChange(value)
                  handleSelectValue(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("rewardType.placeholder")} />
                </SelectTrigger>
                <SelectContent className="bg-primaryBg text-primary">
                  {Object.values(CHEST_REWARD_TYPES).map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="hover:cursor-pointer"
                    >
                      {t(`rewardType.select.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>
                {errors.rewardType ? t("rewardType.error") : null}
              </FormMessage>
            </FormItem>
          )}
        />

        {rewardType === "crown" ? (
          <FormField
            control={form.control}
            name="reward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("reward.crown.label")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    max={MAX_CROWN_REWARD}
                    value={field.value ? field.value.toString() : ""}
                    onChange={(e) => handleRewardChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage>
                  {errors.reward ? t("reward.crown.error") : null}
                </FormMessage>
              </FormItem>
            )}
          />
        ) : (
          <>
            <FormField
              control={form.control}
              name="reward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("reward.artifact.label")}</FormLabel>
                  <Select
                    value={field.value ? field.value.toString() : undefined}
                    onValueChange={(value) => handleRewardChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("reward.artifact.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-primaryBg text-primary">
                      {artifacts && artifacts?.length > 0 ? (
                        artifacts?.map((artifact) => (
                          <SelectItem key={artifact.id} value={artifact.id}>
                            {artifact.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center text-sm">
                          {t("reward.artifact.empty")}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <ArtifactPopover onUpload={(data) => handleUploadArtifact(data)} />
          </>
        )}

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
                  max={MAX_USERS_PER_CHEST}
                  value={field.value}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    form.setValue("maxUsers", value, { shouldValidate: true })
                  }}
                />
              </FormControl>
              <FormMessage>
                {errors.maxUsers ? t("maxUsers.error") : null}
              </FormMessage>
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
