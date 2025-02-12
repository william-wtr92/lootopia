"use client"

import { Button, Card, CardContent, CardHeader, CardTitle } from "@lootopia/ui"
import { SquarePen } from "lucide-react"
import { useEffect } from "react"

import { Link } from "@client/i18n/routing"
import { routes } from "@client/utils/routes"
import AlertDeleteHunt from "@client/web/components/features/hunts/utils/AlertDeleteHunt"
import { useHuntStore } from "@client/web/store/useHuntStore"

const HuntListPage = () => {
  const { hunts, removeHunt, setActiveHunt, activeHuntId } = useHuntStore()

  const handleRemoveHunt = (huntId: string) => {
    removeHunt(huntId)
  }

  useEffect(() => {
    if (activeHuntId) {
      setActiveHunt(null)
    }
  }, [setActiveHunt, activeHuntId])

  return (
    <div className="relative flex h-[75vh] items-center justify-center overflow-hidden">
      <Card className="border-primary bg-primaryBg z-0 w-2/5 opacity-95">
        <CardHeader className="text-center">
          <CardTitle className="text-primary text-3xl font-bold">
            Chasses brouillons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-primary flex h-96 flex-col gap-2 overflow-auto">
            {Object.entries(hunts).map(([huntId, { hunt }]) => (
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
          <Link href={routes.hunts.create}>
            <Button className="text-primary bg-accent hover:bg-accent-hover mt-6 w-full">
              Créer une chasse
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default HuntListPage
