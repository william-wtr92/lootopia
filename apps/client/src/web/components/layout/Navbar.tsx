"use client"

import { Button } from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { Crown, Plus, Swords, UserCog } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import Logo from "./Logo"
import { Link } from "@client/i18n/routing"
import ShopPopup from "@client/web/components/features/shop/ShopPopup"
import UsersSearchCommand from "@client/web/components/features/users/list/UsersSearchCommand"
import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import SelectLocale from "@client/web/components/utils/SelectLocale"
import { routes } from "@client/web/routes"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import { useAuthStore } from "@client/web/store/useAuthStore"
import anim from "@client/web/utils/anim"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"

const Navbar = () => {
  const t = useTranslations("Components.NavBar")

  const { scrollY } = useScroll()
  const token = useAuthStore((state) => state.token)

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserLoggedIn(),
    enabled: !!token,
  })

  const user = data ? data : undefined

  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleShopOpen = () => {
    setIsShopOpen((prev) => !prev)
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    const MIN_SCROLL = 90
    setIsScrolled(latest > MIN_SCROLL)
  })

  return (
    <motion.header
      className={`sticky left-0 top-0 z-[11] h-fit px-16 py-8 transition-colors duration-300 ${
        isScrolled ? "bg-white/20 shadow-md backdrop-blur" : ""
      }`}
    >
      <nav className="flex items-center justify-between">
        <Link href={routes.home}>
          <MotionComponent
            className="z-20 flex items-center gap-2"
            {...anim(logoVariant)}
          >
            <Logo width={50} height={50} />

            <span className="text-primary text-2xl font-bold">
              {t("title")}
            </span>
          </MotionComponent>
        </Link>

        <MotionComponent
          className="flex items-center justify-end space-x-4"
          {...anim(buttonsVariant)}
        >
          <div className="z-20 flex items-center space-x-4">
            <SelectLocale />
            {!user ? (
              <>
                <Link href={routes.auth.login}>
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-secondary"
                  >
                    {t("login")}
                  </Button>
                </Link>
                <Link href={routes.auth.register}>
                  <Button className="bg-primary text-accent hover:bg-secondary">
                    {t("register")}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <UsersSearchCommand />

                <Link href={routes.hunts.list}>
                  <Button className="bg-primary text-accent hover:bg-secondary">
                    <Swords />
                    <span>{t("hunts")}</span>
                  </Button>
                </Link>
                <Link href={routes.users.profile}>
                  <Button className="bg-primary text-accent hover:bg-secondary">
                    <UserCog />
                    <span> {t("profile")}</span>
                  </Button>
                </Link>
                <div className="flex items-center rounded-md">
                  <div className="text-primary bg-accent relative left-2 z-10 flex flex-1 items-center gap-2 rounded-l-xl px-4 py-1 font-semibold">
                    <span className="whitespace-nowrap">
                      {formatCrowns(user.crowns!)}
                    </span>
                    <Crown size={20} />
                  </div>
                  <Button
                    className="bg-primary text-accent hover:bg-secondary z-20 size-8 cursor-pointer rounded-r-md p-1"
                    onClick={handleShopOpen}
                  >
                    <Plus size={10} />
                  </Button>
                </div>
              </>
            )}
          </div>
        </MotionComponent>
      </nav>

      <ShopPopup
        isOpen={isShopOpen}
        onClose={handleShopOpen}
        currentCrowns={user?.crowns ?? undefined}
      />
    </motion.header>
  )
}

export default Navbar

const logoVariant = {
  initial: {
    opacity: 0,
    x: -20,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
}

const buttonsVariant = {
  initial: {
    opacity: 0,
    x: 20,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
}
