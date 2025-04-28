import { Button } from "@lootopia/ui"
import { useQueryClient } from "@tanstack/react-query"
import { LogOut } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"

import { config } from "@client/env"
import { routes } from "@client/web/routes"
import { logout } from "@client/web/services/auth/logout"
import type { UserLoggedInResponse } from "@client/web/services/users/getUserLoggedIn"
import { useAuthStore } from "@client/web/store/useAuthStore"

type Props = {
  user: UserLoggedInResponse
}

const AdminNavbarUser = ({ user }: Props) => {
  const router = useRouter()
  const qc = useQueryClient()
  const { clearAuthToken } = useAuthStore()

  const logoutUser = async () => {
    await logout()

    clearAuthToken()

    qc.removeQueries({ queryKey: ["user"] })

    router.push(routes.auth.login)
  }

  return (
    <div className="bg-primaryBg text-primary flex h-fit items-center justify-between p-4">
      <div className="flex items-center justify-start gap-2">
        <Image
          src={
            user?.avatar
              ? config.blobUrl + user?.avatar
              : "/avatar-placeholder.png"
          }
          alt="Avatar"
          width={40}
          height={40}
          className="aspect-square rounded-full object-contain"
        />

        <div className="flex flex-col">
          <span className="text-secondary text-md font-semibold leading-[20px]">
            {user.nickname}
          </span>
          <span className="text-secondary text-sm leading-[16px]">
            {user.email}
          </span>
        </div>
      </div>
      <Button variant={"ghost"} className="size-[40px]" onClick={logoutUser}>
        <LogOut />
      </Button>
    </div>
  )
}

export default AdminNavbarUser
