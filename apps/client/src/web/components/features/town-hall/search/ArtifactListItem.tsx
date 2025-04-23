import type { ArtifactRarity } from "@lootopia/common"
import { Card, Button, Badge } from "@lootopia/ui"
import { Clock, Crown, Eye, Gem, Hourglass } from "lucide-react"
import { useLocale } from "next-intl"

import type { ArtifactOffersResponse } from "@client/web/services/town-hall/getOffers"
import { getArtifactRarityGradient } from "@client/web/utils/def/colors"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"
import {
  formatDate,
  formatDateDiff,
} from "@client/web/utils/helpers/formatDate"

type Props = {
  artifactOffer: ArtifactOffersResponse
  setSelectedArtifact: (artifact: ArtifactOffersResponse) => void
  setIsPurchaseModalOpen: (isOpen: boolean) => void
  setIsHistoryOpen: (isOpen: boolean) => void
}

const ArtifactListItem = ({
  artifactOffer,
  setSelectedArtifact,
  setIsPurchaseModalOpen,
  setIsHistoryOpen,
}: Props) => {
  const locale = useLocale()

  const handleArtifactClick = (artifactOffer: Props["artifactOffer"]) => {
    setSelectedArtifact(artifactOffer)
    setIsHistoryOpen(true)
  }

  if (!artifactOffer || !artifactOffer.artifact || !artifactOffer.offer) {
    return (
      <div className="text-primary/50 py-8 text-center">
        Aucune offre trouvée
      </div>
    )
  }

  return (
    <Card
      key={artifactOffer.artifact.id}
      className="border-primary/20 hover:border-primary/50 cursor-pointer overflow-hidden transition-all"
      onClick={() => handleArtifactClick(artifactOffer)}
    >
      <div
        className={`p-3 ${getArtifactRarityGradient(artifactOffer.artifact.rarity as ArtifactRarity)} opacity-80`}
      >
        <div className="flex items-center justify-between">
          <h3 className="w-32 truncate font-bold">
            {artifactOffer.artifact.name}
          </h3>
          <Badge variant="outline" className="text-primary/80 bg-white/70">
            <Hourglass className="mr-1 size-3" />
            {formatDateDiff(artifactOffer.offer.expiresAt, locale)}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Gem className="text-secondary mr-2 size-5" />
            <span className="text-primary font-medium">
              {artifactOffer.artifact.rarity}
            </span>
          </div>
          <div className="text-primary flex items-center text-xl font-semibold">
            <span>{formatCrowns(artifactOffer.offer.price)}</span>
            <Crown className="ml-1 size-5" />
          </div>
        </div>

        <p className="text-primary/70 w-52 truncate text-sm">
          {artifactOffer.offer.description}
        </p>

        <div className="text-primary/70 flex items-center justify-between text-xs">
          <div className="flex items-center">
            <Clock className="mr-1 size-3" />
            <span>
              Mis en vente le{" "}
              {formatDate(artifactOffer.offer.createdAt, locale)}
            </span>
          </div>
          <div className="flex items-center">
            <Eye className="mr-1 size-3" />
            <span>{artifactOffer.views} vues</span>
          </div>
        </div>

        <div className="border-primary/10 flex items-end justify-between border-t">
          <div className="text-primary text-sm">
            Vendeur:{" "}
            <span className="font-medium">{artifactOffer.sellerNickname}</span>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-secondary text-accent relative top-2"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedArtifact(artifactOffer)
              setIsPurchaseModalOpen(true)
            }}
          >
            Acheter
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ArtifactListItem
