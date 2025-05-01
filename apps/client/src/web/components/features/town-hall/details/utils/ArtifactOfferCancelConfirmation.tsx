import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  useToast,
} from "@lootopia/ui"
import { useQueryClient } from "@tanstack/react-query"
import { TicketX } from "lucide-react"
import { useTranslations } from "next-intl"

import { cancelOffer } from "@client/web/services/town-hall/offers/cancelOffer"
import type { ArtifactOffersResponse } from "@client/web/services/town-hall/offers/getOffers"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  artifactOfferId: ArtifactOffersResponse["offer"]["id"]
  setIsOpen: (isOpen: boolean) => void
}

const ArtifactOfferCancelConfirmation = ({
  artifactOfferId,
  setIsOpen,
}: Props) => {
  const t = useTranslations(
    "Components.TownHall.Details.Utils.ArtifactOfferCancelConfirmation"
  )
  const { toast } = useToast()
  const qc = useQueryClient()

  const handleCancelOffer = async () => {
    const [status, key] = await cancelOffer({
      offerId: artifactOfferId,
    })

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${key}`),
      })

      return
    }

    toast({
      variant: "default",
      description: t("success"),
    })

    setIsOpen(false)

    qc.invalidateQueries({ queryKey: ["artifactOffers"] })
    qc.invalidateQueries({
      queryKey: ["artifactOffer", artifactOfferId],
    })
    qc.invalidateQueries({ queryKey: ["availableArtifacts"] })
    qc.invalidateQueries({ queryKey: ["userOfferStats"] })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <span className="flex items-center gap-2">
            <TicketX className="text-destructive size-4" />
            {t("trigger")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="text-primary p-4">
        <DialogTitle className="flex items-center gap-2">
          <TicketX className="text-destructive size-5" />
          <span>{t("title")}</span>
        </DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              {t("cta.cancel")}
            </Button>
          </DialogClose>

          <Button variant="destructive" size="sm" onClick={handleCancelOffer}>
            {t("cta.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ArtifactOfferCancelConfirmation
