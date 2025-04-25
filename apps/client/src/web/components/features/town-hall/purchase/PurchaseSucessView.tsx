import { Button } from "@lootopia/ui"
import { motion } from "framer-motion"
import { ArrowRight, Check, User } from "lucide-react"
import { useTranslations } from "next-intl"

import type { ArtifactOffersResponse } from "@client/web/services/town-hall/offers/getOffers"
import anim from "@client/web/utils/anim"
import { formatOfferCrowns } from "@client/web/utils/helpers/formatCrowns"

type Props = {
  artifactOffer: ArtifactOffersResponse
  onClose: () => void
}

const PurchaseSuccessView = ({ artifactOffer, onClose }: Props) => {
  const t = useTranslations("Components.TownHall.Purchase.PurchaseSuccessView")

  return (
    <motion.div
      key="success"
      {...anim(successCardVariants)}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex flex-col items-center justify-center space-y-6 py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="border-success bg-success/10 rounded-full border-4 p-4"
      >
        <Check className="text-success size-12" />
      </motion.div>

      <div className="text-center">
        <motion.h3
          {...anim(titleVariants)}
          className="text-primary mb-2 text-xl font-bold"
        >
          {t("title")}
        </motion.h3>
        <motion.p
          {...anim(descriptionVariants)}
          className="text-primary/70 flex items-center gap-2"
        >
          {t.rich("description", {
            artifactName: artifactOffer?.artifact?.name,
            price: formatOfferCrowns(artifactOffer.offer.price),
            strong: (children) => (
              <span className="font-semibold">{children}</span>
            ),
          })}
        </motion.p>
      </div>

      <motion.div
        {...anim(transferLineVariants)}
        className="border-primary/20 flex w-full items-center justify-center gap-4 rounded-lg border bg-white/50 p-4"
      >
        <div className="flex items-center">
          <User className="text-secondary mr-2 size-5" />
          <span className="text-primary/80">
            {artifactOffer.sellerNickname}
          </span>
        </div>
        <ArrowRight className="text-primary/50 size-5" />
        <div className="flex items-center">
          <User className="text-secondary mr-2 size-5" />
          <span className="text-primary/80">{t("you")}</span>
        </div>
      </motion.div>

      <motion.div {...anim(buttonVariants)}>
        <Button
          onClick={onClose}
          className="bg-primary hover:bg-secondary text-accent mt-4"
        >
          {t("cta.close")}
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default PurchaseSuccessView

const successCardVariants = {
  initial: { opacity: 0, scale: 0.9 },
  enter: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0 },
}

const titleVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.3 } },
}

const descriptionVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.3 } },
}

const transferLineVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.3 } },
}

const buttonVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { delay: 1, duration: 0.3 } },
}
