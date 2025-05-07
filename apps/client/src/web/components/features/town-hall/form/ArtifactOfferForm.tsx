import { zodResolver } from "@hookform/resolvers/zod"
import {
  type ArtifactOfferSchema,
  artifactOfferSchema,
  artifactRarity,
  type ArtifactRarity,
  defaultLimit,
  defaultPage,
  DURATIONS_IN_DAYS,
  MINIMUM_OFFER_PRICE,
} from "@lootopia/common"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Textarea,
  Button,
  Badge,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@lootopia/ui"
import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { Clock, AlertCircle, CheckCircle2, Crown } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useFormMutation } from "@client/web/hooks/useFormMutation"
import { usePaginationObserver } from "@client/web/hooks/usePaginationObserver"
import { getAvailableArtifacts } from "@client/web/services/town-hall/offers/getAvailableArtifacts"
import { publishOffer } from "@client/web/services/town-hall/offers/publishOffer"
import { getArtifactRarityColor } from "@client/web/utils/def/colors"
import { formatDate } from "@client/web/utils/helpers/formatDate"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

const ArtifactOfferForm = () => {
  const t = useTranslations("Components.TownHall.Form.ArtifactOfferForm")
  const locale = useLocale()
  const qc = useQueryClient()

  const [inputValue, setInputValue] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["availableArtifacts", inputValue],
      queryFn: () =>
        getAvailableArtifacts({
          page: defaultPage.toString(),
          limit: defaultLimit.toString(),
          search: inputValue,
        }),

      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage) {
          return undefined
        }

        return allPages.length - 1 < lastPage.lastPage
          ? allPages.length
          : undefined
      },
      initialPageParam: defaultPage,
      placeholderData: keepPreviousData,
    })

  const allArtifacts = data?.pages.flatMap((page) => page?.result) ?? []

  const { containerRef, sentinelRef, checkIfShouldFetchNextPage } =
    usePaginationObserver({ fetchNextPage, hasNextPage, isFetchingNextPage })

  const form = useForm<ArtifactOfferSchema>({
    resolver: zodResolver(artifactOfferSchema),
    defaultValues: {
      userArtifactId: "",
      price: MINIMUM_OFFER_PRICE,
      duration: DURATIONS_IN_DAYS[1],
      description: "",
    },
  })

  const {
    formState: { errors },
  } = form

  const artifactOffer = allArtifacts.find(
    (artifact) => artifact?.userArtifactId === form.watch("userArtifactId")
  )

  const { mutateAsync: submitOffer } = useFormMutation(
    publishOffer,
    {
      success: () => t("success"),
      error: (key) => translateDynamicKey(t, `errors.${key}`),
    },
    {
      onSuccess: () => {
        form.reset()

        qc.invalidateQueries({ queryKey: ["artifactOffers"] })
        qc.invalidateQueries({
          queryKey: ["availableArtifacts", inputValue],
        })
        qc.invalidateQueries({
          queryKey: ["userOfferStats"],
        })

        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      },
    }
  )

  const onSubmit = async (data: ArtifactOfferSchema) => {
    await submitOffer(data)
  }

  const handleSetValue = (value: string) => {
    setInputValue(value)
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl items-center pb-6">
      {showSuccess ? (
        <Card className="border-success/50 bg-success/10">
          <CardHeader>
            <CardTitle className="text-success flex items-center">
              <CheckCircle2 className="mr-2 size-5" />
              {t("card.title")}
            </CardTitle>
            <CardDescription className="text-success/80">
              {t("card.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-success/80">{t("card.description")}</p>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-h-[55vh] w-full space-y-6 overflow-y-auto"
          >
            <Card className="border-primary/20 text-primary">
              <CardHeader>
                <CardTitle className="text-primary">
                  {t("form.title")}
                </CardTitle>
                <CardDescription>{t("form.description")}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="userArtifactId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.artifacts.label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-primary/30">
                            <SelectValue
                              placeholder={t(
                                "form.fields.artifacts.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          ref={containerRef}
                          className="bg-primaryBg text-primary max-h-[250px] overflow-y-auto"
                          onScroll={checkIfShouldFetchNextPage}
                        >
                          <div className="p-2">
                            <Input
                              placeholder={t("form.fields.artifacts.search")}
                              value={inputValue}
                              onChange={(e) => handleSetValue(e.target.value)}
                              className="border-primary/30 mb-2 w-full"
                            />
                          </div>

                          {allArtifacts.map((item) => (
                            <SelectItem
                              key={item?.userArtifactId}
                              value={item?.userArtifactId ?? ""}
                            >
                              <div className="flex items-center">
                                <span>{item?.artifact?.name}</span>
                                <Badge
                                  className={`ml-2 ${getArtifactRarityColor(item?.artifact?.rarity as ArtifactRarity)}`}
                                >
                                  {t(
                                    `form.fields.artifacts.rarities.${item?.artifact?.rarity ?? artifactRarity.common}`
                                  )}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}

                          {isFetchingNextPage && (
                            <div className="text-muted py-2 text-center text-sm">
                              {t("form.fields.artifacts.loading")}
                            </div>
                          )}

                          {!allArtifacts.length && !isFetchingNextPage && (
                            <div className="text-muted py-4 text-center text-sm">
                              {t("form.fields.artifacts.empty")}
                            </div>
                          )}
                          <div ref={sentinelRef} className="h-1" />
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {errors.userArtifactId
                          ? t("form.fields.artifacts.error")
                          : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {artifactOffer && (
                  <Card
                    className={`${getArtifactRarityColor(
                      artifactOffer?.artifact?.rarity as ArtifactRarity
                    )} border-none`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {artifactOffer?.artifact?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        {t("form.fields.artifacts.card.obtainedInHunt", {
                          huntName: artifactOffer?.huntName,
                        })}
                      </p>
                      <div className="mt-2 flex items-center text-xs">
                        <Clock className="mr-1 size-3" />
                        <span>
                          {t("form.fields.artifacts.card.obtainedAt", {
                            date: formatDate(artifactOffer?.obtainedAt, locale),
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.price.label")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Crown className="text-primary/50 absolute left-2 top-2.5 size-4" />
                          <Input
                            type="number"
                            min={MINIMUM_OFFER_PRICE}
                            placeholder={t("form.fields.price.placeholder")}
                            className="border-primary/30 pl-8"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value === "" ? "" : Number(value))
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage>
                        {errors.price ? t("form.fields.price.error") : null}
                      </FormMessage>
                      {artifactOffer && (
                        <p className="text-primary/70 flex items-center gap-1 text-xs">
                          <span>
                            {t("form.fields.price.suggestedPrice.label", {
                              price: t(
                                `form.fields.price.suggestedPrice.values.${
                                  artifactOffer?.artifact?.rarity ??
                                  artifactRarity.common
                                }`
                              ),
                            })}
                          </span>
                          <Crown className="size-3" />
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.duration.label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-primary/30">
                            <SelectValue
                              placeholder={t(
                                "form.fields.duration.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-primaryBg text-primary">
                          <SelectItem value={DURATIONS_IN_DAYS[0]}>
                            {t("form.fields.duration.options.3days")}
                          </SelectItem>
                          <SelectItem value={DURATIONS_IN_DAYS[1]}>
                            {t("form.fields.duration.options.7days")}
                          </SelectItem>
                          <SelectItem value={DURATIONS_IN_DAYS[2]}>
                            {t("form.fields.duration.options.14days")}
                          </SelectItem>
                          <SelectItem value={DURATIONS_IN_DAYS[3]}>
                            {t("form.fields.duration.options.30days")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {errors.duration
                          ? t("form.fields.duration.error")
                          : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.fields.description.label")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("form.fields.description.placeholder")}
                          className="border-primary/30 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {errors.description
                          ? t("form.fields.description.error")
                          : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <div className="border-primary/10 bg-primary/5 rounded-md border p-4">
                  <div className="flex items-start">
                    <AlertCircle className="text-primary mr-2 mt-0.5 size-5 flex-shrink-0" />
                    <div className="text-primary/80 text-sm">
                      <p className="mb-1 font-medium">
                        {t("form.terms.title")}
                      </p>
                      <ul className="list-disc space-y-1 pl-5">
                        <li>{t("form.terms.fees")}</li>
                        <li>{t("form.terms.cancelation")}</li>
                        <li>{t("form.terms.responsibility")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="bg-primary text-accent hover:bg-secondary w-full"
                  disabled={!form.formState.isValid}
                >
                  {form.formState.isSubmitting
                    ? t("form.submit.publishing")
                    : t("form.submit.publish")}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ArtifactOfferForm
