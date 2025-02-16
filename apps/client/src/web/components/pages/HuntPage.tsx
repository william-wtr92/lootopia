import {
  type HuntSchema,
  parsePosition,
  type ChestSchema,
  type PositionSchema,
} from "@lootopia/common"
import {
  Card,
  CardContent,
  CardFooter,
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
  useToast,
} from "@lootopia/ui"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Link } from "@client/i18n/routing"
import { translateDynamicKey } from "@client/utils/helpers/translateDynamicKey"
import { routes } from "@client/utils/routes"
import ChestForm from "@client/web/components/features/hunts/form/ChestForm"
import HuntForm from "@client/web/components/features/hunts/form/HuntForm"
import PositionForm from "@client/web/components/features/hunts/form/PositionForm"
import Map from "@client/web/components/features/hunts/Map"
import ActionsButton from "@client/web/components/features/hunts/utils/ActionsButton"
import { createFullHunt } from "@client/web/services/hunts/createFullHunt"
import { useHuntStore } from "@client/web/store/useHuntStore"

type Props = {
  huntId?: string
}

const HuntPage = ({ huntId }: Props) => {
  const t = useTranslations("Pages.Hunts.Create")
  const {
    activeHuntId,
    hunts,
    createHunt,
    removeHunt,
    getHuntWithChests,
    addChest,
    isSheetOpen,
    currentChest,
    setPosition,
    setIsSheetOpen,
    setCurrentChest,
    setActiveHunt,
  } = useHuntStore()
  const { toast } = useToast()
  const router = useRouter()

  const [map, setMap] = useState<L.Map | null>(null)
  const [activeTab, setActiveTab] = useState("hunt")
  const [isHuntCreated, setIsHuntCreated] = useState(!!huntId)

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

  const handleDraftSave = () => {
    router.push(routes.hunts.list)
  }

  const handleSubmitAll = async () => {
    const huntWithChests = activeHuntId ? getHuntWithChests(activeHuntId) : null

    if (!huntWithChests) {
      toast({
        variant: "destructive",
        description: t("notFound"),
      })

      return
    }

    const chestsWithoutId = huntWithChests.chests.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ id, ...chest }) => chest
    )

    const payload = {
      hunt: huntWithChests.hunt,
      chests: chestsWithoutId,
    }

    const [status, keys] = await createFullHunt(payload)

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${keys}`),
      })

      return
    }

    toast({
      variant: "default",
      description: t("success"),
    })

    router.push(routes.hunts.list)

    if (activeHuntId) {
      removeHunt(activeHuntId)
    }
  }

  return (
    <main className="relative mb-20 items-center justify-center">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="hunt"
        className="relative z-50"
      >
        <TabsList className="text-primary bg-primaryBg z-20 mx-auto grid w-2/5 grid-cols-2 rounded-lg border shadow-md">
          <TabsTrigger value="hunt">{t("tabs.triggers.hunt")}</TabsTrigger>
          <TabsTrigger value="chests" disabled={!isHuntCreated}>
            {t("tabs.triggers.chests")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hunt">
          <Card className="border-primary bg-primaryBg z-0 mx-auto mt-6 w-2/5 p-4 opacity-95">
            <CardTitle className="text-primary text-center text-3xl font-bold">
              {t("tabs.content.title")}
            </CardTitle>
            <CardContent className="mt-6">
              <HuntForm onSubmit={handleHuntSubmit} />
            </CardContent>
            <CardFooter className="text-primary flex justify-center gap-1 text-sm">
              {t("tabs.content.link")}
              <Link href={routes.hunts.list}>
                <span className="text-secondary font-semibold">
                  {t("tabs.content.here")}
                </span>
              </Link>
            </CardFooter>
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
              <ActionsButton
                handleDraftSave={handleDraftSave}
                handleSubmitAll={handleSubmitAll}
                isValid={isValid}
              />
            )}
          </div>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="bg-primaryBg text-primary">
              <SheetHeader>
                <SheetTitle>{t("sheet.title")}</SheetTitle>
                <SheetDescription>{t("sheet.description")}</SheetDescription>
              </SheetHeader>
              <ChestForm
                initialData={currentChest}
                onSubmit={handleChestSubmit}
              />
            </SheetContent>
          </Sheet>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default HuntPage
