import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
  DialogContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@lootopia/ui"
import { Search, TrendingUp, PlusCircle, Store } from "lucide-react"
import { useState } from "react"

import ArtifactSellForm from "./form/ArtifactOfferForm"
import type { ArtifactMocked } from "./mock-data"
import ArtifacList from "./search/ArtifactList"
import PurchaseConfirmation from "./utils/PurchaseConfirmation"

type Props = {
  open: boolean
  setIsOpen: (open: boolean) => void
}

const TownHallDialog = ({ open, setIsOpen }: Props) => {
  const [activeTab, setActiveTab] = useState("browse")

  const [selectedArtifact, setSelectedArtifact] =
    useState<ArtifactMocked | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  return (
    <>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent className="border-primary bg-primaryBg max-h-[75vh] overflow-hidden rounded-xl p-0 sm:max-w-[900px]">
          <div className="flex h-full flex-col">
            <DialogHeader className="border-primary/20 bg-primaryBg sticky top-0 z-10 border-b px-6 pb-4 pt-6">
              <DialogTitle className="text-primary flex items-center text-xl font-bold">
                <Store className="text-secondary mr-2 size-6" /> Town Hall
              </DialogTitle>
              <DialogDescription className="text-primary/70">
                Achetez, vendez et suivez les artefacts les plus précieux de
                Lootopia
              </DialogDescription>
            </DialogHeader>

            <Tabs
              defaultValue="browse"
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex h-full flex-1 flex-col"
            >
              <div className="bg-primaryBg sticky top-[85px] z-10 px-6 pt-4">
                <TabsList className="border-primary/20 bg-primary/10 grid w-full grid-cols-3 border">
                  <TabsTrigger
                    value="browse"
                    className="text-primary data-[state=active]:bg-primary data-[state=active]:text-accent flex items-center"
                  >
                    <Search className="mr-2 size-4" /> Parcourir
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="text-primary data-[state=active]:bg-primary data-[state=active]:text-accent flex items-center"
                  >
                    <TrendingUp className="mr-2 size-4" /> Statistiques
                  </TabsTrigger>
                  <TabsTrigger
                    value="sell"
                    className="text-primary data-[state=active]:bg-primary data-[state=active]:text-accent flex items-center"
                  >
                    <PlusCircle className="mr-2 size-4" /> Vendre
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <TabsContent
                  value="browse"
                  className="mt-0 h-full data-[state=active]:block"
                >
                  <ArtifacList
                    selectedArtifact={selectedArtifact}
                    setSelectedArtifact={setSelectedArtifact}
                    setIsPurchaseModalOpen={setIsPurchaseModalOpen}
                  />
                </TabsContent>

                <TabsContent
                  value="stats"
                  className="mt-0 h-full data-[state=active]:block"
                >
                  {/* <MarketStats /> */}
                </TabsContent>

                <TabsContent
                  value="sell"
                  className="mt-0 h-full data-[state=active]:block"
                >
                  <ArtifactSellForm />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {selectedArtifact && (
        <PurchaseConfirmation
          artifact={selectedArtifact}
          open={isPurchaseModalOpen}
          setIsOpen={setIsPurchaseModalOpen}
        />
      )}
    </>
  )
}

export default TownHallDialog
