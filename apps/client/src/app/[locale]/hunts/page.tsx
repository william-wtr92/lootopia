"use client"

import { Button, Card, CardContent, CardHeader, CardTitle } from "@lootopia/ui"
import { SquarePen } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect } from "react"

import { Link } from "@client/i18n/routing"
import { routes } from "@client/utils/routes"
import AlertDeleteHunt from "@client/web/components/features/hunts/utils/AlertDeleteHunt"
import { useHuntStore } from "@client/web/store/useHuntStore"

const HuntListPage = () => {
  const t = useTranslations("Pages.Hunts.List")
  const { hunts, removeHunt, setActiveHunt, activeHuntId } = useHuntStore()
  const huntsArray = Object.entries(hunts)

  const handleRemoveHunt = (huntId: string) => {
    removeHunt(huntId)
  }

  useEffect(() => {
    if (activeHuntId) {
      setActiveHunt(null)
    }
  }, [setActiveHunt, activeHuntId])

  return (
    <main className="relative flex w-full flex-1 items-center justify-center">
      <Card className="mb-12 w-2/5">
        <CardHeader className="text-center">
          <CardTitle className="text-primary text-3xl font-bold">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {huntsArray.length === 0 ? (
            <p className="text-primary flex h-96 items-center justify-center text-center text-lg font-semibold">
              {t("empty")}
            </p>
          ) : (
            <ul className="text-primary flex h-96 flex-col gap-2 overflow-auto">
              {huntsArray.map(([huntId, { hunt }]) => (
                <li
                  key={huntId}
                  className="hover:bg-accent flex cursor-pointer items-center justify-between rounded-md p-3 transition"
                >
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">{hunt.name}</p>
                    {hunt.description && (
                      <p className="text-sm">{hunt.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link key={huntId} href={routes.hunts.id(huntId)}>
                      <SquarePen size={20} />
                    </Link>

                    <AlertDeleteHunt
                      huntId={huntId}
                      onDelete={() => handleRemoveHunt(huntId)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link href={routes.hunts.create}>
            <Button className="text-primary bg-accent hover:bg-accent-hover mt-6 w-full">
              {t("cta.create")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}

export default HuntListPage
