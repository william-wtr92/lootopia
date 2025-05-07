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
import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"

import { deleteParticipation } from "@client/web/services/participations/deleteParticipation"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  open: boolean
  setIsOpen: (open: boolean) => void
  huntId: string
}

const DeleteParticipationDialog = ({ open, setIsOpen, huntId }: Props) => {
  const t = useTranslations(
    "Components.Hunts.List.Participations.DeleteParticipationDialog"
  )

  const { toast } = useToast()
  const qc = useQueryClient()

  const handleDeleteParticipation = async () => {
    const [status, key] = await deleteParticipation({ huntId })

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
            <LogOut className="size-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t.rich("description", {
              br: () => <br />,
              space: () => <span className="inline-block w-0.5" />,
              strong: (children) => (
                <span className="font-semibold">{children}</span>
              ),
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
            variant="destructive"
            onClick={() => {
              handleDeleteParticipation()
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

export default DeleteParticipationDialog
