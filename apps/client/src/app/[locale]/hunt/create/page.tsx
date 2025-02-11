"use client"

import {
  type HuntSchema,
  parsePosition,
  type ChestSchema,
  type PositionSchema,
} from "@lootopia/common"
import {
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
import { useState } from "react"

import ChestForm from "@client/web/components/map/form/ChestForm"
import HuntForm from "@client/web/components/map/form/HuntForm"
import PositionForm from "@client/web/components/map/form/PositionForm"
import Map from "@client/web/components/map/Map"
import { useHuntStore } from "@client/web/store/useHuntStore"

const MapPage = () => {
  const [map, setMap] = useState<L.Map | null>(null)
  const [activeTab, setActiveTab] = useState("hunt")
  const [isHuntCreated, setIsHuntCreated] = useState(false)

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
  } = useHuntStore()

  const activeHunt = activeHuntId ? hunts[activeHuntId] : null
  const chests = activeHunt ? activeHunt.chests : []

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
    createHunt(data)
    setIsHuntCreated(true)
    setActiveTab("chests")
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
            <Card className="bg-primaryBg absolute right-5 top-5 z-[20] px-3 py-2">
              <PositionForm onSubmit={handlePositionSubmit} />
            </Card>
            <Map map={map} setMap={setMap} chests={chests} />
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

export default MapPage
