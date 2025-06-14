"use client"

import { useQuery } from "@tanstack/react-query"
import { Settings, TrendingUp, UsersRound } from "lucide-react"
import { useTranslations } from "next-intl"
import React from "react"

import AdminNavbarCategories from "@client/web/components/layout/admin/navbar/AdminNavbarCategories"
import AdminNavbarUser from "@client/web/components/layout/admin/navbar/AdminNavbarUser"
import Logo from "@client/web/components/layout/Logo"
import { routes } from "@client/web/routes"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import { useAuthStore } from "@client/web/store/useAuthStore"

const AdminNavbar = () => {
  const t = useTranslations("Components.Admin.Navbar")
  const token = useAuthStore((state) => state.token)

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserLoggedIn(),
    enabled: !!token,
  })

  const user = data ? data : undefined

  const mainMenuLinks = [
    {
      icon: <TrendingUp />,
      label: t("main-menu-category.links.dashboard.label"),
      href: routes.admin.dashboard,
    },
    {
      icon: <UsersRound />,
      label: t("main-menu-category.links.users.label"),
      href: routes.admin.users,
    },
  ]

  const websiteManagementLinks = [
    {
      icon: <Settings />,
      label: t("website-management-category.links.settings.label"),
      href: "#",
    },
  ]

  return (
    <div className="flex h-screen w-[20%] flex-col overflow-hidden rounded-br-2xl rounded-tr-2xl">
      <div className="bg-primaryBg border-b-1 border-secondary flex items-center justify-center gap-2 py-4 pr-4">
        <Logo width={50} height={50} />

        <h1 className="text-primary text-xl font-semibold">{t("title")}</h1>
      </div>

      <AdminNavbarCategories
        label={t("main-menu-category.title")}
        links={mainMenuLinks}
      />

      <AdminNavbarCategories
        label={t("website-management-category.title")}
        links={websiteManagementLinks}
      />

      {user && <AdminNavbarUser user={user} />}
    </div>
  )
}

export default AdminNavbar
