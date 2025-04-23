import type { ArtifactRarity } from "@lootopia/common"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  useToast,
} from "@lootopia/ui"
import { useQueryClient } from "@tanstack/react-query"
import { AnimatePresence } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { useState } from "react"

import PurchaseConfirmationView from "./PurchaseConfirmationView"
import PurchaseProcessingView from "./PurchaseProcessingView"
import PurchaseSuccessView from "./PurchaseSucessView"
import { useConfetti } from "@client/web/hooks/useConfetti"
import type { ArtifactOffersResponse } from "@client/web/services/town-hall/getOffers"
import { purchaseOffer } from "@client/web/services/town-hall/purchaseOffer"
import { getArtifactRarityGradient } from "@client/web/utils/def/colors"

export const purchaseStage = {
  confirmation: "confirmation",
  processing: "processing",
  success: "success",
} as const
export type PurchaseStage = (typeof purchaseStage)[keyof typeof purchaseStage]

type Props = {
  artifactOffer: ArtifactOffersResponse | null
  open: boolean
  setIsOpen: (isOpen: boolean) => void
}

const PurchaseDialog = ({ artifactOffer, open, setIsOpen }: Props) => {
  const { toast } = useToast()
  const qc = useQueryClient()

  const [stage, setStage] = useState<PurchaseStage>(purchaseStage.confirmation)
  const [showConfetti, setShowConfetti] = useState(false)

  const handlePurchaseOffer = async () => {
    if (!artifactOffer) {
      return
    }

    const [status, key] = await purchaseOffer({
      offerId: artifactOffer.offer.id,
    })

    if (!status) {
      toast({
        title: "Erreur",
        description: key,
        variant: "destructive",
      })

      return
    }

    qc.invalidateQueries({ queryKey: ["artifactOffers"] })
    qc.invalidateQueries({ queryKey: ["artifactInventory"] })
    qc.invalidateQueries({ queryKey: ["availableArtifacts"] })
    qc.invalidateQueries({ queryKey: ["user"] })

    toast({
      variant: "default",
      description: "L'offre a été achetée avec succès.",
    })

    handleTriggerSuccessFlow()
  }

  const handleTriggerSuccessFlow = () => {
    setStage(purchaseStage.processing)
    setShowConfetti(true)

    setTimeout(() => {
      setStage(purchaseStage.success)

      setTimeout(handleClose, 3000)
    }, 2000)
  }

  const handleClose = () => {
    setIsOpen(false)

    setTimeout(() => {
      setStage(purchaseStage.confirmation)
      setShowConfetti(false)
    }, 300)
  }

  useConfetti({
    enabled: showConfetti,
  })

  if (!artifactOffer || !artifactOffer.artifact || !artifactOffer.offer) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-primary bg-primaryBg max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader
          className={`p-6 ${getArtifactRarityGradient(artifactOffer.artifact.rarity as ArtifactRarity)}`}
        >
          <DialogTitle className="flex items-center text-xl font-bold">
            <ShoppingBag className="mr-2 size-5" /> Achat d'artefact
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {stage === purchaseStage.confirmation && (
            <PurchaseConfirmationView
              artifactOffer={artifactOffer}
              onClose={handleClose}
              onPurchase={handlePurchaseOffer}
            />
          )}

          {stage === purchaseStage.processing && (
            <PurchaseProcessingView
              artifactRarity={artifactOffer.artifact.rarity}
            />
          )}

          {stage === purchaseStage.success && (
            <PurchaseSuccessView
              artifactOffer={artifactOffer}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

export default PurchaseDialog
