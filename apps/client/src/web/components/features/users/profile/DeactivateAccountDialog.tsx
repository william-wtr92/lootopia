import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  DialogClose,
} from "@lootopia/ui"
import { UserXIcon } from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {
  onConfirm: () => void
}

const DeactivateAccountDialog = ({ onConfirm }: Props) => {
  const t = useTranslations("Components.Users.DeactivateAccountDialog")

  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-1">
        <Button variant="destructive" className="flex w-full items-center">
          <UserXIcon />
          <span>{t("trigger")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="text-primary">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t("cta.cancel")}
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            {t("cta.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeactivateAccountDialog
