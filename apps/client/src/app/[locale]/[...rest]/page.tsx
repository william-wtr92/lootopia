import { Button } from "@lootopia/ui"
import { useTranslations } from "next-intl"

import { routes } from "@client/utils/routes"
import CustomLink from "@client/web/components/utils/CustomLink"

const CatchAllPage = () => {
  const t = useTranslations("Pages.NotFound")

  return (
    <div className="flex h-[75vh] items-center justify-center overflow-hidden">
      <div className="border-1 container relative z-10 mx-auto flex flex-col gap-6 px-4 py-16 text-center">
        <h1 className="text-primary text-6xl font-bold">{t("title")}</h1>
        <p className="text-primary text-xl">{t("description")}</p>
        <CustomLink href={routes.home}>
          <Button className="hover:bg-accentHover" size={"lg"}>
            {t("cta.home")}
          </Button>
        </CustomLink>
      </div>
    </div>
  )
}

export default CatchAllPage
