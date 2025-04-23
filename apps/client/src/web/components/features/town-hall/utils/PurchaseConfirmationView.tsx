import type { ArtifactRarity } from "@lootopia/common"
import { Badge, Button } from "@lootopia/ui"
import { motion } from "framer-motion"
import { Gem, User } from "lucide-react"

import type { ArtifactOffersResponse } from "@client/web/services/town-hall/getOffers"
import { getArtifactRarityColor } from "@client/web/utils/def/colors"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"

type Props = {
  artifactOffer: ArtifactOffersResponse
  onClose: () => void
  onPurchase: () => void
}

const PurchaseConfirmationView = ({
  artifactOffer,
  onClose,
  onPurchase,
}: Props) => {
  return (
    <motion.div
      key="confirmation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-6"
    >
      <div className="text-center">
        <h3 className="text-primary mb-2 text-lg font-bold">
          Confirmer l'achat
        </h3>
        <p className="text-primary/70">
          Vous êtes sur le point d'acheter cet artefact à{" "}
          {artifactOffer.sellerNickname}
        </p>
      </div>

      <div className="flex items-center justify-center gap-6">
        <div
          className={`rounded-full p-6 ${getArtifactRarityColor(artifactOffer?.artifact?.rarity as ArtifactRarity)}`}
        >
          <Gem className="size-12" />
        </div>
        <div className="text-center">
          <h4 className="text-primary text-lg font-bold">
            {artifactOffer?.artifact?.name}
          </h4>
          <Badge
            className={`mt-1 ${getArtifactRarityColor(artifactOffer?.artifact?.rarity as ArtifactRarity)}`}
          >
            {artifactOffer?.artifact?.rarity}
          </Badge>
        </div>
      </div>

      <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-primary/70">Prix:</span>
          <span className="text-primary text-xl font-bold">
            {formatCrowns(artifactOffer.offer.price)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-primary/70">Vendeur:</span>
          <div className="flex items-center">
            <User className="text-secondary mr-1 size-4" />
            <span className="text-primary font-medium">
              {artifactOffer.sellerNickname}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-primary text-primary flex-1"
        >
          Annuler
        </Button>
        <Button
          onClick={onPurchase}
          className="bg-primary hover:bg-secondary text-accent flex-1"
        >
          Confirmer l'achat
        </Button>
      </div>
    </motion.div>
  )
}

export default PurchaseConfirmationView
