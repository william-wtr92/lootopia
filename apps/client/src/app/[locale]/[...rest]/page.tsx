import { Button } from "@lootopia/ui"
import { useTranslations } from "next-intl"

import { Link } from "@client/i18n/routing"
import { routes } from "@client/utils/routes"

const CatchAllPage = () => {
  const t = useTranslations("Pages.NotFound")

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden">
      <div className="border-1 container relative z-10 mx-auto flex flex-col gap-6 px-4 py-16 text-center">
        <h1 className="text-primary text-6xl font-bold">{t("title")}</h1>
        <p className="text-primary text-xl">{t("description")}</p>
        <Link href={routes.home}>
          <Button className="hover:bg-accentHover" size={"lg"}>
            {t("cta.home")}
          </Button>
        </Link>
      </div>
    </main>
  )
}

export default CatchAllPage
