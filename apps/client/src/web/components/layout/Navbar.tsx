"use client"

import { Button } from "@lootopia/ui"
import { useTranslations } from "next-intl"

import Logo from "./Logo"
import { Link } from "@client/i18n/routing"
import { routes } from "@client/utils/routes"
import SelectLocale from "@client/web/components/utils/SelectLocale"

const Navbar = () => {
  const t = useTranslations("Components.NavBar")

  return (
    <header className="container relative z-10 mx-auto w-screen px-4 py-8">
      <nav className="flex items-center justify-between">
        <Link href={routes.home}>
          <div className="flex items-center space-x-2">
            <Logo width={50} height={50} />
            <span className="text-primary text-2xl font-bold">
              {t("title")}
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <SelectLocale />
          <div className="flex items-center space-x-4">
            <Link href={routes.login}>
              <Button
                variant="ghost"
                className="text-primary hover:text-secondary"
              >
                {t("login")}
              </Button>
            </Link>
            <Link href={routes.register}>
              <Button className="bg-primary text-accent hover:bg-secondary">
                {t("register")}
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
