"use client"

import {
  type HuntSchema,
  parsePosition,
  type ChestSchema,
  type PositionSchema,
} from "@lootopia/common"
import {
  Button,
  Card,
  CardTitle,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@lootopia/ui"
import { useEffect, useState } from "react"

import ChestForm from "@client/web/components/map/form/ChestForm"
import HuntForm from "@client/web/components/map/form/HuntForm"
import PositionForm from "@client/web/components/map/form/PositionForm"
import Map from "@client/web/components/map/Map"
import { useHuntStore } from "@client/web/store/useHuntStore"

type Props = {
  huntId?: string
}

const HuntPage = ({ huntId }: Props) => {
  const [map, setMap] = useState<L.Map | null>(null)
  const [activeTab, setActiveTab] = useState("hunt")
  const [isHuntCreated, setIsHuntCreated] = useState(!!huntId)

  const {
    activeHuntId,
    hunts,
    createHunt,
    addChest,
    isSheetOpen,
    currentChest,
    setPosition,
    setIsSheetOpen,
    setCurrentChest,
    setActiveHunt,
  } = useHuntStore()

  useEffect(() => {
    if (huntId && hunts[huntId]) {
      setActiveHunt(huntId)
      setIsHuntCreated(true)
    }
  }, [huntId, hunts, setActiveHunt])

  const activeHunt = activeHuntId ? hunts[activeHuntId] : null
  const chests = activeHunt ? activeHunt.chests : []

  const isValid =
    activeHuntId &&
    activeHunt &&
    activeHunt.hunt &&
    activeHunt.chests.length > 1

  const handlePositionSubmit = (data: PositionSchema) => {
    const newPosition = parsePosition(data)
    setPosition(newPosition)

    if (map) {
      map.flyTo(newPosition, 16, {
        duration: 2,
      })
    }
  }

  const handleChestSubmit = (data: ChestSchema) => {
    if (activeHuntId) {
      addChest(activeHuntId, data)
      setCurrentChest(null)
      setIsSheetOpen(false)
    }
  }

  const handleHuntSubmit = (data: HuntSchema) => {
    const newHuntId = createHunt(data)

    if (newHuntId) {
      setIsHuntCreated(true)
      setActiveTab("chests")
    }
  }

  const handleSubmitAll = () => {
    // eslint-disable-next-line no-console
    console.log("Submit all")
  }

  return (
    <div className="relative">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="hunt"
        className="relative z-50"
      >
        <TabsList className="text-primary bg-primaryBg z-20 mx-auto grid w-2/5 grid-cols-2 rounded-lg border shadow-md">
          <TabsTrigger value="hunt">Hunt</TabsTrigger>
          <TabsTrigger value="chests" disabled={!isHuntCreated}>
            Chests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hunt">
          <Card className="border-primary bg-primaryBg z-0 mx-auto mt-6 w-2/5 p-4 opacity-95">
            <CardTitle className="text-primary text-center text-3xl font-bold">
              Créer une chasse
            </CardTitle>
            <div className="mt-6">
              <HuntForm onSubmit={handleHuntSubmit} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="chests">
          <div className="relative mx-auto mt-6 w-3/5">
            {map && (
              <Card className="bg-primaryBg absolute right-5 top-5 z-[20] px-3 py-2">
                <PositionForm onSubmit={handlePositionSubmit} />
              </Card>
            )}
            <Map map={map} setMap={setMap} chests={chests} />
            {map && (
              <Button
                onClick={handleSubmitAll}
                disabled={!isValid}
                className="text-primary bg-accent hover:bg-accent-hover absolute bottom-5 left-1/2 z-[20] w-96 -translate-x-1/2 transform"
              >
                Valider la création
              </Button>
            )}
          </div>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="bg-primaryBg text-primary">
              <SheetHeader>
                <SheetTitle>Ajouter un coffre</SheetTitle>
                <SheetDescription>
                  Décrivez le contenu et l'emplacement du coffre.
                </SheetDescription>
              </SheetHeader>
              <ChestForm
                initialData={currentChest}
                onSubmit={handleChestSubmit}
              />
            </SheetContent>
          </Sheet>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HuntPage
