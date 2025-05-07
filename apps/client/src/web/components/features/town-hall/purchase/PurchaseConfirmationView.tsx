import { artifactRarity, type ArtifactRarity } from "@lootopia/common"
import { Badge, Button } from "@lootopia/ui"
import { motion } from "framer-motion"
import { Crown, Gem, User } from "lucide-react"
import { useTranslations } from "next-intl"

import type { ArtifactOffersResponse } from "@client/web/services/town-hall/offers/getOffers"
import anim from "@client/web/utils/anim"
import { getArtifactRarityColor } from "@client/web/utils/def/colors"
import { formatOfferCrowns } from "@client/web/utils/helpers/formatCrowns"

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
  const t = useTranslations(
    "Components.TownHall.Purchase.PurchaseConfirmationView"
  )

  return (
    <motion.div
      key="confirmation"
      {...anim(confirmationCardVariants)}
      className="space-y-6 p-6"
    >
      <div className="text-center">
        <h3 className="text-primary mb-2 text-lg font-bold">{t("title")}</h3>
        <p className="text-primary/70">
          {t("description", {
            sellerNickname: artifactOffer.sellerNickname,
          })}
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
            {t(
              `rarities.${artifactOffer?.artifact?.rarity ?? artifactRarity.common}`
            )}
          </Badge>
        </div>
      </div>

      <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-primary/70">{t("price")}</span>
          <span className="text-primary flex items-center gap-2 text-xl font-bold">
            {formatOfferCrowns(artifactOffer.offer.price)}
            <Crown className="size-5" />
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-primary/70">{t("seller")}</span>
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
          {t("cta.cancel")}
        </Button>
        <Button
          onClick={onPurchase}
          className="bg-primary hover:bg-secondary text-accent flex-1"
        >
          {t("cta.confirm")}
        </Button>
      </div>
    </motion.div>
  )
}

export default PurchaseConfirmationView

const confirmationCardVariants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0, y: -20 },
}
