import { zodResolver } from "@hookform/resolvers/zod"
import {
  type ArtifactOfferSchema,
  artifactOfferSchema,
  type ArtifactRarity,
  defaultLimit,
  defaultPage,
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
import { getAvailableArtifacts } from "@client/web/services/town-hall/getAvailableArtifacts"
import { publishOffer } from "@client/web/services/town-hall/publishOffer"
import { getArtifactRarityColor } from "@client/web/utils/def/colors"
import { formatDate } from "@client/web/utils/helpers/formatDate"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

const ArtifactOfferForm = () => {
  const t = useTranslations("Components.TownHall.ArtifactOfferForm")
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
      duration: "7",
      description: "",
    },
  })

  const artifactOffer = allArtifacts.find(
    (artifact) => artifact?.userArtifactId === form.watch("userArtifactId")
  )

  const { mutateAsync: submitOffer } = useFormMutation(
    publishOffer,
    {
      success: () => "Votre artefact est maintenant en vente.",
      error: (key) => translateDynamicKey(t, `errors.${key}`),
    },
    {
      onSuccess: () => {
        form.reset()

        qc.invalidateQueries({ queryKey: ["artifactOffers"] })
        qc.invalidateQueries({
          queryKey: ["availableArtifacts", inputValue],
        })

        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      },
    }
  )

  const onSubmit = async (data: ArtifactOfferSchema) => {
    await submitOffer(data)
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl items-center pb-6">
      {showSuccess ? (
        <Card className="border-success/50 bg-success/10">
          <CardHeader>
            <CardTitle className="text-success flex items-center">
              <CheckCircle2 className="mr-2 size-5" />
              Annonce publiée avec succès
            </CardTitle>
            <CardDescription className="text-success/80">
              Votre artefact a été mis en vente et est maintenant visible dans
              le Town Hall
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-success/80">
              Vous recevrez une notification lorsqu’un acheteur fera une offre
              ou achètera votre artefact.
            </p>
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
                  Vendre un artefact
                </CardTitle>
                <CardDescription>
                  Mettez un artefact de votre collection en vente
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="userArtifactId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choisir un artefact</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-primary/30">
                            <SelectValue placeholder="Choisir un artefact" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          ref={containerRef}
                          className="bg-primaryBg text-primary max-h-[250px] overflow-y-auto"
                          onScroll={checkIfShouldFetchNextPage}
                        >
                          <div className="p-2">
                            <Input
                              placeholder="Rechercher un artefact"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
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
                                  {item?.artifact?.rarity}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}

                          {isFetchingNextPage && (
                            <div className="text-muted py-2 text-center text-sm">
                              Chargement...
                            </div>
                          )}

                          {!allArtifacts.length && !isFetchingNextPage && (
                            <div className="text-muted py-4 text-center text-sm">
                              Aucun artefact trouvé
                            </div>
                          )}
                          <div ref={sentinelRef} className="h-1" />
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
                        Obtenu dans la chasse "{artifactOffer?.huntName}"
                      </p>
                      <div className="mt-2 flex items-center text-xs">
                        <Clock className="mr-1 size-3" />
                        <span>
                          Obtenu le{" "}
                          {formatDate(artifactOffer?.obtainedAt, locale)}
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
                      <FormLabel>Prix</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Crown className="text-primary/50 absolute left-2 top-2.5 size-4" />
                          <Input
                            type="number"
                            min={MINIMUM_OFFER_PRICE}
                            placeholder="Entrez le prix"
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
                      <FormMessage />
                      {artifactOffer && (
                        <p className="text-primary/70 text-xs">
                          Prix suggéré :{" "}
                          {getSuggestedPrice(
                            artifactOffer?.artifact?.rarity as ArtifactRarity
                          )}
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
                      <FormLabel>Durée de l’annonce</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-primary/30">
                            <SelectValue placeholder="Choisir une durée" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-primaryBg text-primary">
                          <SelectItem value="3">3 jours</SelectItem>
                          <SelectItem value="7">7 jours</SelectItem>
                          <SelectItem value="14">14 jours</SelectItem>
                          <SelectItem value="30">30 jours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ajoutez des détails..."
                          className="border-primary/30 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-primary/10 bg-primary/5 rounded-md border p-4">
                  <div className="flex items-start">
                    <AlertCircle className="text-primary mr-2 mt-0.5 size-5 flex-shrink-0" />
                    <div className="text-primary/80 text-sm">
                      <p className="mb-1 font-medium">
                        Informations importantes
                      </p>
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Des frais de 5% seront prélevés sur la vente</li>
                        <li>
                          Vous pouvez annuler l’annonce avant qu’elle soit
                          conclue
                        </li>
                        <li>
                          Les artefacts vendus ne peuvent pas être récupérés
                        </li>
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
                    ? "Publication en cours..."
                    : "Publier l’annonce"}
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

// Remplacer la fonction getSuggestedPrice par celle-ci pour utiliser des couronnes
const getSuggestedPrice = (rarity: ArtifactRarity) => {
  switch (rarity) {
    case "common":
      return "100 - 300 👑"

    case "uncommon":
      return "300 - 1 000 👑"

    case "rare":
      return "1 000 - 5 000 👑"

    case "epic":
      return "5 000 - 20 000 👑"

    case "legendary":
      return "20 000+ 👑"

    default:
      return "N/A"
  }
}
