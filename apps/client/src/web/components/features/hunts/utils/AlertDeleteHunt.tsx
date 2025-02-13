import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@lootopia/ui"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {
  huntId: string
  onDelete: (huntId: string) => void
}

const AlertDeleteHunt = ({ huntId, onDelete }: Props) => {
  const t = useTranslations("Components.Hunts.Utils.AlertDeleteHunt")

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <X className="text-error" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-primaryBg text-primary">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(huntId)}
            className="bg-error text-white"
          >
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDeleteHunt
