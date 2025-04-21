import { Button } from "@lootopia/ui"
import {
  Calendar,
  Crown,
  DollarSign,
  Eye,
  Gem,
  Heart,
  MapPin,
  Share2,
  User,
  View,
} from "lucide-react"
import { useLocale } from "next-intl"

import type { ArtifactMocked } from "../mock-data"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"
import { formatDate } from "@client/web/utils/helpers/formatDate"

type Props = {
  selectedArtifact: ArtifactMocked
  setIsOpen: (isOpen: boolean) => void
  setIsPurchaseModalOpen: (isOpen: boolean) => void
}

const ArtifactDetails = ({
  selectedArtifact,
  //setIsOpen,
  setIsPurchaseModalOpen,
}: Props) => {
  const locale = useLocale()

  const handleVisualize = () => {
    // eslint-disable-next-line no-console
    console.log("Visualiser l'artéfact", selectedArtifact)

    // CALL set state to HuntRewardPill
  }

  const handleBuy = () => {
    setIsPurchaseModalOpen(true)
    //setIsOpen(false)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center">
              <Gem className="text-secondary mr-2 size-5" />
              <span className="text-primary font-medium">
                {selectedArtifact.rarity}
              </span>
            </div>
            <div className="text-primary flex items-center gap-4 text-2xl font-bold">
              <Crown className="text-primary size-7" />
              {formatCrowns(selectedArtifact.price)}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={handleVisualize}
            >
              <View className="mr-1 size-4" /> Visualiser
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary"
            >
              <Heart className="mr-1 size-4" /> Favoris
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

        <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
          <h3 className="text-primary mb-2 font-medium">Description</h3>
          <p className="text-primary/80">{selectedArtifact.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <User className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">Vendeur</h3>
            </div>
            <p className="text-primary/80">{selectedArtifact.seller}</p>
          </div>

          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <MapPin className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">Origine</h3>
            </div>
            <p className="text-primary/80">{selectedArtifact.foundLocation}</p>
          </div>

          <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
            <div className="mb-2 flex items-center">
              <Calendar className="text-secondary mr-2 size-4" />
              <h3 className="text-primary font-medium">
                Date de mise en vente
              </h3>
            </div>
            <p className="text-primary/80">
              {formatDate(selectedArtifact.listedDate.toString(), locale)}
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
    </>
  )
}

export default ArtifactDetails
