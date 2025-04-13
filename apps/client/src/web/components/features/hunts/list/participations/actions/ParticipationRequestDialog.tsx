import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  useToast,
} from "@lootopia/ui"
import { useQueryClient } from "@tanstack/react-query"
import { MapPinPlus } from "lucide-react"
import { useTranslations } from "next-intl"

import { requestParticipation } from "@client/web/services/participations/requestParticipation"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  open: boolean
  setIsOpen: (open: boolean) => void
  huntId: string
}

const ParticipationRequestDialog = ({ open, setIsOpen, huntId }: Props) => {
  const t = useTranslations(
    "Components.Hunts.List.Participations.ParticipationRequestDialog"
  )

  const { toast } = useToast()
  const qc = useQueryClient()

  const handleRequest = async () => {
    const [status, key] = await requestParticipation({ huntId })

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

    qc.invalidateQueries({ queryKey: ["hunts"] })
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="border-primary bg-primaryBg p-6">
        <DialogHeader className="text-primary">
          <DialogTitle className="flex items-center gap-2">
            <MapPinPlus className="size-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t.rich("description", {
              br: () => <br />,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-primary text-primary"
          >
            {t("cta.cancel")}
          </Button>
          <Button
            onClick={() => {
              handleRequest()
              setIsOpen(false)
            }}
          >
            {t("cta.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ParticipationRequestDialog
