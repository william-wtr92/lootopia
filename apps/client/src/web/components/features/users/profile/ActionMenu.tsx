import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from "@lootopia/ui"
import {
  Banknote,
  Edit,
  Flag,
  LogOut,
  MoreHorizontal,
  ShieldCheck,
  ShieldX,
} from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {
  onLogout: () => void
  onEditProfile: () => void
  onListReports: () => void
  onListPayments: () => void
  mfaEnabled: boolean
  onActivateMFA: () => void
  onDeactivateMFA: () => void
  onDeactivateAccount: () => void
}

const ActionMenu = ({
  onLogout,
  onEditProfile,
  onListReports,
  onListPayments,
  mfaEnabled,
  onActivateMFA,
  onDeactivateMFA,
  onDeactivateAccount,
}: Props) => {
  const t = useTranslations("Components.Users.Profile.ActionMenu")

  return (
    <div className="self-center md:self-start">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <MoreHorizontal className="mr-2 size-4" />
            {t("title")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-primary bg-primaryBg w-56 md:relative md:right-14">
          <DropdownMenuLabel className="text-primary bg-primary/15">
            {t("label")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-primary/20" />
          <DropdownMenuItem
            className="text-primary focus:bg-primary/10 cursor-pointer"
            onClick={onEditProfile}
          >
            <Edit className="mr-2 size-4" />
            <span>{t("actions.editProfile")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-primary focus:bg-primary/10 cursor-pointer"
            onClick={onListReports}
          >
            <Flag className="mr-2 size-4" />
            <span>{t("actions.myReports")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-primary focus:bg-primary/10 cursor-pointer"
            onClick={onListPayments}
          >
            <Banknote className="mr-2 size-4" />
            <span>{t("actions.myPayments")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-primary focus:bg-primary/10 cursor-pointer"
            onClick={() => (mfaEnabled ? onDeactivateMFA() : onActivateMFA())}
          >
            {mfaEnabled ? (
              <ShieldX className="mr-2 size-4" />
            ) : (
              <ShieldCheck className="mr-2 size-4" />
            )}
            <span>
              {mfaEnabled
                ? t("actions.deactivateMfa")
                : t("actions.activateMfa")}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-primary/20" />
          <DropdownMenuItem
            className="text-error focus:bg-error cursor-pointer focus:text-white"
            onClick={onDeactivateAccount}
          >
            <ShieldX className="mr-2 size-4" />
            <span>{t("actions.deactivateAccount")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-primary/20" />
          <DropdownMenuItem
            className="text-error focus:bg-error cursor-pointer focus:text-white"
            onClick={onLogout}
          >
            <LogOut className="mr-2 size-4" />
            <span>{t("actions.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ActionMenu
