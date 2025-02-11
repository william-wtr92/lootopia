"use client"

import { Button, Card, CardContent, CardHeader, CardTitle } from "@lootopia/ui"

import { Link } from "@client/i18n/routing"
import { routes } from "@client/utils/routes"
import { useHuntStore } from "@client/web/store/useHuntStore"

const HuntListPage = () => {
  const hunts = useHuntStore((state) => state.hunts)

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
              <Link key={huntId} href={routes.hunts.id(huntId)}>
                <li
                  key={huntId}
                  className="hover:bg-accent cursor-pointer rounded-md p-3 transition"
                >
                  <p className="text-lg font-semibold">{hunt.name}</p>
                  {hunt.description && (
                    <p className="text-sm">{hunt.description}</p>
                  )}
                </li>
              </Link>
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
