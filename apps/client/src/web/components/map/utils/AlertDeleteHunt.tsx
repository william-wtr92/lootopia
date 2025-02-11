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

type Props = {
  huntId: string
  onDelete: (huntId: string) => void
}

const AlertDeleteHunt = ({ huntId, onDelete }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <X className="text-error" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-primaryBg text-primary">
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cette chasse ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(huntId)}
            className="bg-error text-white"
          >
            Continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDeleteHunt
