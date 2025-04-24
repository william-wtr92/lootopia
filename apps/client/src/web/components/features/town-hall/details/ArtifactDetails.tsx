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
import { useLocale } from "next-intl"
import { useState } from "react"

import HuntRewardPill from "@client/web/components/features/hunts/list/rewards/HuntRewardPill"
import { addToFavorites } from "@client/web/services/town-hall/addToFavorites"
import { getFavorite } from "@client/web/services/town-hall/getFavorite"
import type { ArtifactOffersResponse } from "@client/web/services/town-hall/getOffers"
import { formatOfferCrowns } from "@client/web/utils/helpers/formatCrowns"
import { formatDate } from "@client/web/utils/helpers/formatDate"

type Props = {
  selectedArtifact: ArtifactOffersResponse
  setIsOpen: (isOpen: boolean) => void
  setIsPurchaseModalOpen: (isOpen: boolean) => void
}

const ArtifactDetails = ({
  selectedArtifact,
  setIsOpen,
  setIsPurchaseModalOpen,
}: Props) => {
  const locale = useLocale()
  const { toast } = useToast()
  const qc = useQueryClient()

  const [showArtifact, setShowArtifact] = useState(false)

  const { data: isFavorite } = useQuery({
    queryKey: ["artifactIsFavorite", selectedArtifact.offer.id],
    queryFn: () => getFavorite({ offerId: selectedArtifact.offer.id }),
    enabled: !!selectedArtifact.offer.id,
  })

  const isFavoriteStatus = isFavorite ? isFavorite : false

  const handleAddToFavorites = async () => {
    const [status, key] = await addToFavorites(
      {
        offerId: selectedArtifact.offer.id,
      },
      {
        favorite: !isFavoriteStatus,
      }
    )

    if (!status) {
      toast({
        variant: "destructive",
        description: key,
      })

      return
    }

    toast({
      variant: "default",
      description: isFavoriteStatus
        ? "L’artéfact a été retiré de vos favoris"
        : "L’artéfact a été ajouté à vos favoris",
    })

    qc.invalidateQueries({
      queryKey: ["artifactIsFavorite", selectedArtifact.offer.id],
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

  if (!selectedArtifact || !selectedArtifact.artifact) {
    return (
      <div className="text-primary/50 py-8 text-center">
        Aucune offre trouvée
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center">
              <Gem className="text-secondary mr-2 size-5" />
              <span className="text-primary font-medium">
                {selectedArtifact.artifact.rarity}
              </span>
            </div>
            <div className="text-primary flex items-center gap-4 text-2xl font-bold">
              <Crown className="text-primary size-7" />
              {formatOfferCrowns(selectedArtifact.offer.price)}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => handleVisualize(true)}
            >
              <View className="mr-1 size-4" /> Visualiser
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
                <>
                  <HeartOff className="mr-1 size-4" /> Retirer des favoris
                </>
              ) : (
                <>
                  <Heart className="mr-1 size-4" /> Ajoute au favoris
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary"
            >
              <Share2 className="mr-1 size-4" /> Partager
            </Button>
          </div>
        </div>

        <div className="border-primary/20 w-full rounded-lg border bg-white/50 p-4">
          <h3 className="text-primary mb-2 font-medium">Description</h3>
          <p className="text-primary/80 line-clamp-5 break-words break-all">
            {selectedArtifact.offer.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <User className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">Vendeur</h3>
            </div>
            <p className="text-primary/80">{selectedArtifact.sellerNickname}</p>
          </div>

          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <MapPin className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">Origine</h3>
            </div>
            <p className="text-primary/80">{selectedArtifact.huntCity}</p>
          </div>

          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <Calendar className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">
                Date de mise en vente
              </h3>
            </div>
            <p className="text-primary/80">
              {formatDate(selectedArtifact.offer.createdAt, locale)}
            </p>
          </div>

          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <Eye className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">Vues</h3>
            </div>
            <p className="text-primary/80">
              {selectedArtifact.views} visiteurs
            </p>
          </div>
        </div>

        <Button
          className="bg-primary hover:bg-secondary text-accent w-full"
          onClick={handleBuy}
        >
          <DollarSign className="mr-2 size-4" /> Acheter maintenant
        </Button>
      </div>

      {showArtifact && (
        <HuntRewardPill
          artifactId={selectedArtifact.artifact.id}
          onOpenChange={(isOpen) => handleVisualize(isOpen)}
        />
      )}
    </>
  )
}

export default ArtifactDetails
