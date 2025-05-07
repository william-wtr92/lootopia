import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  DialogClose,
  useToast,
} from "@lootopia/ui"
import { useQueryClient } from "@tanstack/react-query"
import { ShieldX } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { routes } from "@client/web/routes"
import { deactivateAccount } from "@client/web/services/users/deactivateAccount"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  open: boolean
  setIsOpen: (open: boolean) => void
}

const DeactivateAccountDialog = ({ open, setIsOpen }: Props) => {
  const t = useTranslations("Components.Users.DeactivateAccountDialog")
  const router = useRouter()
  const { toast } = useToast()
  const qc = useQueryClient()

  const handleDeactivateAccount = async () => {
    const [status, key] = await deactivateAccount()

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

    qc.invalidateQueries({ queryKey: ["user"] })

    router.push(routes.auth.login)
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="text-primary p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldX className="size-5" />
            <span>{t("title")}</span>
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t("cta.cancel")}
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDeactivateAccount}>
            {t("cta.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeactivateAccountDialog
