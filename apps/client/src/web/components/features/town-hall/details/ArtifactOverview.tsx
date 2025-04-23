import { artifactRarity, type ArtifactRarity } from "@lootopia/common"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from "@lootopia/ui"
import { Gem, History, Eye, Hourglass } from "lucide-react"
import { useLocale } from "next-intl"
import { useState } from "react"

import ArtifactDetails from "./ArtifactDetails"
import ArtifactHistory from "./history/ArtifactHistory"
import { useViewTracking } from "@client/web/hooks/useViewTracking"
import type { ArtifactOffersResponse } from "@client/web/services/town-hall/getOffers"
import { getArtifactRarityGradient } from "@client/web/utils/def/colors"
import { formatDateDiff } from "@client/web/utils/helpers/formatDate"

type Props = {
  selectedArtifact: ArtifactOffersResponse
  open: boolean
  setIsOpen: (open: boolean) => void
  setIsPurchaseModalOpen: (open: boolean) => void
}

const ArtifactOverview = ({
  selectedArtifact,
  open,
  setIsOpen,
  setIsPurchaseModalOpen,
}: Props) => {
  const locale = useLocale()
  const [activeTab, setActiveTab] = useState("details")

  useViewTracking({
    offerId: selectedArtifact.offer.id,
  })

  if (!selectedArtifact || !selectedArtifact.artifact) {
    return null
  }

  const isLegendary =
    selectedArtifact.artifact.rarity === artifactRarity.legendary

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="border-primary bg-primaryBg max-h-[85vh] overflow-hidden p-0 sm:max-w-[800px]">
        <div className="flex h-full max-h-[85vh] flex-col">
          <DialogHeader
            className={`p-4 ${getArtifactRarityGradient(selectedArtifact.artifact.rarity as ArtifactRarity)} text-primary relative top-0 z-20 overflow-hidden`}
          >
            {isLegendary && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="animate-shine absolute left-0 top-0 h-full w-full bg-gradient-to-r from-yellow-300/0 via-yellow-300/30 to-yellow-300/0"></div>
                </div>
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-300/20 blur-xl"></div>
              </div>
            )}
            <DialogTitle className="relative z-10 flex items-center text-xl font-bold">
              <Gem
                className={`mr-2 h-6 w-6 ${isLegendary ? "text-amber-600" : ""}`}
              />
              <span className="flex-1 text-white">
                {selectedArtifact.artifact.name}
              </span>
              <Badge variant="outline" className="ml-2 bg-white/70 text-xs">
                <Hourglass className="mr-1 size-3" />
                {formatDateDiff(selectedArtifact.offer.expiresAt, locale)}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="bg-primaryBg sticky top-0 z-10 p-6">
              <TabsList className="border-primary/20 bg-primary/10 grid w-full grid-cols-2 border">
                <TabsTrigger
                  value="details"
                  className="text-primary data-[state=active]:bg-primary data-[state=active]:text-accent flex items-center"
                >
                  <Eye className="mr-2 h-4 w-4" /> Détails
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="text-primary data-[state=active]:bg-primary data-[state=active]:text-accent flex items-center"
                >
                  <History className="mr-2 h-4 w-4" /> Historique
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto">
              <TabsContent
                value="details"
                className="mt-0 overflow-auto p-6 data-[state=active]:block"
              >
                <ArtifactDetails
                  selectedArtifact={selectedArtifact}
                  setIsOpen={setIsOpen}
                  setIsPurchaseModalOpen={setIsPurchaseModalOpen}
                />
              </TabsContent>

              <TabsContent
                value="history"
                className="mt-0 overflow-auto p-0 data-[state=active]:block"
              >
                <ArtifactHistory selectedArtifact={selectedArtifact} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ArtifactOverview
