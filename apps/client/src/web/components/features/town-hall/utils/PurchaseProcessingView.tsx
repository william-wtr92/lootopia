import type { ArtifactRarity } from "@lootopia/common"
import { motion } from "framer-motion"
import { Crown, Gem } from "lucide-react"

import { getArtifactRarityColor } from "@client/web/utils/def/colors"

type Props = {
  artifactRarity: ArtifactRarity | null
}

const PurchaseProcessingView = ({ artifactRarity }: Props) => {
  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center space-y-6 py-12"
    >
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          className="absolute -left-16 top-0"
        >
          <Crown className="text-accent size-12" />
        </motion.div>

        <motion.div
          animate={{
            x: [-60, 60],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          className="absolute top-2"
        >
          <Crown className="text-accent size-8" />
        </motion.div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="relative z-10"
        >
          <div
            className={`rounded-full p-6 ${getArtifactRarityColor(artifactRarity as ArtifactRarity)}`}
          >
            <Gem className="size-12" />
          </div>
        </motion.div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            delay: 0.5,
          }}
          className="absolute -right-16 top-0"
        >
          <Crown className="text-accent size-12" />
        </motion.div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-primary mb-2 text-lg font-bold">
          Transaction en cours
        </h3>
        <p className="text-primary/70">
          Veuillez patienter pendant que nous traitons votre achat...
        </p>
      </div>

      <motion.div className="bg-primary/20 mt-4 h-2 w-48 overflow-hidden rounded-full">
        <motion.div
          className="bg-secondary h-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}

export default PurchaseProcessingView
