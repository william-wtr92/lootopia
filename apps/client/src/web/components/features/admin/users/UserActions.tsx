import {
  AlertDialog,
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@lootopia/ui"
import { MoreHorizontal, PowerOff, Power } from "lucide-react"
import { useTranslations } from "next-intl"
import React from "react"

import type { UserWithPrivateInfo } from "@client/web/services/admin/users/getUsersList"

type Props = {
  user: UserWithPrivateInfo
  handleUpdateUserActive: (email: string) => void
}

const UserActions = ({ user, handleUpdateUserActive }: Props) => {
  const t = useTranslations("Pages.Admin.Users.actions")

  return (
    <AlertDialog key={user.email}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-primary border-primary border text-white"
        >
          <DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
          <DropdownMenuItem
            className={`bg-primary text-white ${user.active ? "hover:bg-error" : "hover:bg-success"}`}
          >
            <AlertDialogTrigger className="flex items-center gap-2">
              {user.active ? (
                <>
                  <PowerOff size={16} />
                  <span>{t("userActiveUpdate.triggerDeactivate")}</span>
                </>
              ) : (
                <>
                  <Power size={16} />
                  <span>{t("userActiveUpdate.triggerActivate")}</span>
                </>
              )}
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>

        <AlertDialogContent className="bg-primaryBg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("userActiveUpdate.dialog.title")}{" "}
              <span className="text-secondary">{user.nickname}</span> ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("userActiveUpdate.dialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("userActiveUpdate.dialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdateUserActive(user.email)}
            >
              {t("userActiveUpdate.dialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  )
}

export default UserActions
