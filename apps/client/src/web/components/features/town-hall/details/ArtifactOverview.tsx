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
import { useQuery } from "@tanstack/react-query"
import { Gem, History, Eye, Hourglass } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import ArtifactDetails from "./ArtifactDetails"
import ArtifactHistory from "./history/ArtifactHistory"
import { useViewTracking } from "@client/web/hooks/useViewTracking"
import type { ArtifactOffersResponse } from "@client/web/services/town-hall/offers/getOffers"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import { getArtifactRarityGradient } from "@client/web/utils/def/colors"
import { formatDateDiff } from "@client/web/utils/helpers/formatDate"

type Props = {
  artifactOffer: ArtifactOffersResponse
  open: boolean
  setIsOpen: (open: boolean) => void
  setIsPurchaseModalOpen: (open: boolean) => void
}

const ArtifactOverview = ({
  artifactOffer,
  open,
  setIsOpen,
  setIsPurchaseModalOpen,
}: Props) => {
  const t = useTranslations("Components.TownHall.Details.ArtifactOverview")
  const locale = useLocale()

  const { data: userLoggedIn } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserLoggedIn(),
  })

  const [activeTab, setActiveTab] = useState("details")

  useViewTracking({
    offerId: artifactOffer.offer.id,
  })

  if (!artifactOffer || !artifactOffer.artifact) {
    return null
  }

  const isLegendary = artifactOffer.artifact.rarity === artifactRarity.legendary

  const isOwner = userLoggedIn?.id === artifactOffer.offer.sellerId

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="border-primary bg-primaryBg flex h-[70vh] flex-col overflow-hidden p-0 sm:max-w-[800px]">
        <DialogHeader
          className={`p-4 ${getArtifactRarityGradient(artifactOffer.artifact.rarity as ArtifactRarity)} text-primary relative top-0 z-20 overflow-hidden`}
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
              className={`mr-2 size-6 ${isLegendary ? "text-amber-600" : ""}`}
            />
            <span className="flex-1 text-white">
              {artifactOffer.artifact.name}
            </span>
            <Badge variant="outline" className="ml-2 bg-white/70 text-xs">
              <Hourglass className="mr-1 size-3" />
              {formatDateDiff(artifactOffer.offer.expiresAt, locale)}
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
                <Eye className="mr-2 size-4" />
                {t("tabs.details")}
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-primary data-[state=active]:bg-primary data-[state=active]:text-accent flex items-center"
              >
                <History className="mr-2 size-4" />
                {t("tabs.history")}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1">
            <TabsContent
              value="details"
              className="mt-0 h-full p-6 data-[state=active]:block"
            >
              <ArtifactDetails
                artifactOffer={artifactOffer}
                setIsOpen={setIsOpen}
                setIsPurchaseModalOpen={setIsPurchaseModalOpen}
                isOwner={isOwner}
              />
            </TabsContent>

            <TabsContent
              value="history"
              className="mt-0 p-3 data-[state=active]:block"
            >
              <ArtifactHistory artifactOffer={artifactOffer} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default ArtifactOverview
