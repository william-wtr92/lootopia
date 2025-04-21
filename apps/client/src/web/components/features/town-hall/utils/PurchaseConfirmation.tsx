import type { ArtifactRarity } from "@lootopia/common"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
} from "@lootopia/ui"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Check, Gem, ArrowRight, User, ShoppingBag } from "lucide-react"
import { useState } from "react"

import type { ArtifactMocked } from "../mock-data"
import {
  getArtifactRarityColor,
  getArtifactRarityGradient,
} from "@client/web/utils/def/colors"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"

type Props = {
  artifact: ArtifactMocked
  open: boolean
  setIsOpen: (isOpen: boolean) => void
}

const PurchaseConfirmation = ({ artifact, open, setIsOpen }: Props) => {
  const [stage, setStage] = useState("confirmation") // confirmation, processing, success
  const [showConfetti, setShowConfetti] = useState(false)

  const handleConfirmPurchase = () => {
    setStage("processing")

    // Simuler le traitement du paiement
    setTimeout(() => {
      setStage("success")
      setShowConfetti(true)

      // Masquer les confettis après quelques secondes
      setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
    }, 2000)
  }

  const handleClose = () => {
    setIsOpen(false)
    // Réinitialiser l'état après la fermeture
    setTimeout(() => {
      setStage("confirmation")
      setShowConfetti(false)
    }, 300)
  }

  if (!artifact) {
    return null
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="border-primary bg-primaryBg max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader
            className={`p-6 ${getArtifactRarityGradient(artifact.rarity as ArtifactRarity)}`}
          >
            <DialogTitle className="flex items-center text-xl font-bold">
              <ShoppingBag className="mr-2 size-5" /> Achat d'artefact
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {stage === "confirmation" && (
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
                    {artifact.seller}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <div
                    className={`rounded-full p-6 ${getArtifactRarityColor(artifact.rarity as ArtifactRarity)}`}
                  >
                    <Gem className="size-12" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-primary text-lg font-bold">
                      {artifact.name}
                    </h4>
                    <Badge
                      className={`mt-1 ${getArtifactRarityColor(artifact.rarity as ArtifactRarity)}`}
                    >
                      {artifact.rarity}
                    </Badge>
                  </div>
                </div>

                <div className="border-primary/20 rounded-lg border bg-white/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-primary/70">Prix:</span>
                    <span className="text-primary text-xl font-bold">
                      {formatCrowns(artifact.price)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-primary/70">Vendeur:</span>
                    <div className="flex items-center">
                      <User className="text-secondary mr-1 size-4" />
                      <span className="text-primary font-medium">
                        {artifact.seller}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-primary text-primary flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleConfirmPurchase}
                    className="bg-primary hover:bg-secondary text-accent flex-1"
                  >
                    Confirmer l'achat
                  </Button>
                </div>
              </motion.div>
            )}

            {stage === "processing" && (
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
                      className={`rounded-full p-6 ${getArtifactRarityColor(artifact.rarity as ArtifactRarity)}`}
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
            )}

            {stage === "success" && (
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
                    Vous avez acquis {artifact.name} pour{" "}
                    {formatCrowns(artifact.price)}
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
                    <span className="text-primary/80">{artifact.seller}</span>
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
                    onClick={handleClose}
                    className="bg-primary hover:bg-secondary text-accent mt-4"
                  >
                    Fermer
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <AnimatePresence>
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  scale: Math.random() * 0.8 + 0.2,
                  rotate: Math.random() * 360,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
                style={{
                  position: "absolute",
                  width: "10px",
                  height: "10px",
                  backgroundColor: [
                    "#FFD700",
                    "#4A0E4E",
                    "#8A4FFF",
                    "#E6C200",
                    "#F8F0E3",
                  ][Math.floor(Math.random() * 5)],
                  borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}

export default PurchaseConfirmation
