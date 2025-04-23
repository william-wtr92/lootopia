import { Button } from "@lootopia/ui"
import { motion } from "framer-motion"
import { ArrowRight, Check, User } from "lucide-react"

import type { ArtifactOffersResponse } from "@client/web/services/town-hall/getOffers"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"

type Props = {
  artifactOffer: ArtifactOffersResponse
  onClose: () => void
}

const PurchaseSuccessView = ({ artifactOffer, onClose }: Props) => {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex flex-col items-center justify-center space-y-6 py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="rounded-full border-4 border-green-500 bg-green-100 p-4"
      >
        <Check className="size-12 text-green-600" />
      </motion.div>

      <div className="text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-primary mb-2 text-xl font-bold"
        >
          Achat réussi !
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-primary/70"
        >
          Vous avez acquis {artifactOffer?.artifact?.name} pour{" "}
          {formatCrowns(artifactOffer.offer.price)}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
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
          <span className="text-primary/80">Vous</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={onClose}
          className="bg-primary hover:bg-secondary text-accent mt-4"
        >
          Fermer
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default PurchaseSuccessView
