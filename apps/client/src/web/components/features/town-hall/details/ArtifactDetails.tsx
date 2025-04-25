import { Button, useToast } from "@lootopia/ui"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Calendar,
  Crown,
  DollarSign,
  Eye,
  Gem,
  Heart,
  HeartOff,
  MapPin,
  Share2,
  User,
  View,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import HuntRewardPill from "@client/web/components/features/hunts/list/rewards/HuntRewardPill"
import { addToFavorites } from "@client/web/services/town-hall/favorites/addToFavorites"
import { getFavorite } from "@client/web/services/town-hall/favorites/getFavorite"
import type { ArtifactOffersResponse } from "@client/web/services/town-hall/offers/getOffers"
import { formatOfferCrowns } from "@client/web/utils/helpers/formatCrowns"
import { formatDate } from "@client/web/utils/helpers/formatDate"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  artifactOffer: ArtifactOffersResponse
  setIsOpen: (isOpen: boolean) => void
  setIsPurchaseModalOpen: (isOpen: boolean) => void
}

const ArtifactDetails = ({
  artifactOffer,
  setIsOpen,
  setIsPurchaseModalOpen,
}: Props) => {
  const t = useTranslations("Components.TownHall.Details.ArtifactDetails")
  const locale = useLocale()
  const { toast } = useToast()
  const qc = useQueryClient()

  const [showArtifact, setShowArtifact] = useState(false)

  const { data: isFavorite } = useQuery({
    queryKey: ["artifactIsFavorite", artifactOffer.offer.id],
    queryFn: () => getFavorite({ offerId: artifactOffer.offer.id }),
    enabled: !!artifactOffer.offer.id,
  })

  const isFavoriteStatus = isFavorite ? isFavorite : false

  const handleAddToFavorites = async () => {
    const [status, key] = await addToFavorites(
      {
        offerId: artifactOffer.offer.id,
      },
      {
        favorite: !isFavoriteStatus,
      }
    )

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${key}`),
      })

      return
    }

    toast({
      variant: "default",
      description: isFavoriteStatus
        ? t("favorites.success.remove")
        : t("favorites.success.add"),
    })

    qc.invalidateQueries({
      queryKey: ["artifactIsFavorite", artifactOffer.offer.id],
    })
    qc.invalidateQueries({
      queryKey: ["artifactOffers"],
      exact: false,
    })
  }

  const handleVisualize = (isOpen: boolean) => {
    if (!isOpen) {
      setShowArtifact(false)

      return
    }

    setShowArtifact(true)
  }

  const handleBuy = () => {
    setIsPurchaseModalOpen(true)
    setIsOpen(false)
  }

  if (!artifactOffer || !artifactOffer.artifact) {
    return <div className="text-primary/50 py-8 text-center">{t("empty")}</div>
  }

  return (
    <>
      <div className="flex h-full flex-col justify-between space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center">
              <Gem className="text-secondary mr-2 size-5" />
              <span className="text-primary font-medium">
                {t(`rarities.${artifactOffer.artifact.rarity}`)}
              </span>
            </div>
            <div className="text-primary flex items-center gap-4 text-2xl font-bold">
              <Crown className="text-primary size-7" />
              {formatOfferCrowns(artifactOffer.offer.price)}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => handleVisualize(true)}
            >
              <View className="mr-1 size-4" />
              {t("cta.visualize")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={`border-primary text-primary hover:bg-primary hover:text-white ${
                isFavoriteStatus ? "bg-primary text-white" : ""
              }`}
              onClick={handleAddToFavorites}
            >
              {isFavoriteStatus ? (
                <span className="flex items-center gap-2">
                  <HeartOff className="size-4" />
                  {t("cta.removeFromFavorites")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Heart className="size-4" />
                  {t("cta.addToFavorites")}
                </span>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary"
            >
              <Share2 className="mr-1 size-4" />
              {t("cta.share")}
            </Button>
          </div>
        </div>

        <div className="border-primary/20 w-full rounded-lg border bg-white/50 p-4">
          <h3 className="text-primary mb-2 font-medium">
            {t("details.description")}
          </h3>
          <p className="text-primary/80 line-clamp-5 break-words break-all">
            {artifactOffer.offer.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <User className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">
                {t("details.seller")}
              </h3>
            </div>
            <p className="text-primary/80">{artifactOffer.sellerNickname}</p>
          </div>

          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <MapPin className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">
                {t("details.origin")}
              </h3>
            </div>
            <p className="text-primary/80">{artifactOffer.huntCity}</p>
          </div>

          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <Calendar className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">
                {t("details.dateOfSale")}
              </h3>
            </div>
            <p className="text-primary/80">
              {formatDate(artifactOffer.offer.createdAt, locale)}
            </p>
          </div>

          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <Eye className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">
                {t("details.views.label")}
              </h3>
            </div>
            <p className="text-primary/80">
              {t("details.views.count", {
                count: artifactOffer.views,
              })}
            </p>
          </div>
        </div>

        <Button className="w-full" onClick={handleBuy}>
          <DollarSign className="mr-2 size-4" />
          {t("cta.buy")}
        </Button>
      </div>

      {showArtifact && (
        <HuntRewardPill
          artifactId={artifactOffer.artifact.id}
          onOpenChange={(isOpen) => handleVisualize(isOpen)}
        />
      )}
    </>
  )
}

export default ArtifactDetails
