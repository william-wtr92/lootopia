import type { ChestSchema } from "@lootopia/common"
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
  Button,
} from "@lootopia/ui"
import { useTranslations } from "next-intl"

type Props = {
  chest: ChestSchema
  onDelete: (chestId: string) => void
}

const AlertDeleteChest = ({ chest, onDelete }: Props) => {
  const t = useTranslations("Components.Hunts.Utils.AlertDeleteChest")

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{t("trigger")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-primaryBg text-primary">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(chest.id)}
            className="bg-error text-white"
          >
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDeleteChest
