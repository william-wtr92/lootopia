import type { ArtifactRarity } from "@lootopia/common"
import { Card, Button, Badge } from "@lootopia/ui"
import { Clock, Eye, Gem } from "lucide-react"
import { useLocale } from "next-intl"

import type { ArtifactMocked } from "../mock-data"
import { getArtifactRarityGradient } from "@client/web/utils/def/colors"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"
import { formatDate } from "@client/web/utils/helpers/formatDate"

type Props = {
  artifact: ArtifactMocked
  setSelectedArtifact: (artifact: ArtifactMocked) => void
  setIsPurchaseModalOpen: (isOpen: boolean) => void
  setIsHistoryOpen: (isOpen: boolean) => void
}

const ArtifactListItem = ({
  artifact,
  setSelectedArtifact,
  setIsPurchaseModalOpen,
  setIsHistoryOpen,
}: Props) => {
  const locale = useLocale()

  const handleArtifactClick = (artifact: Props["artifact"]) => {
    setSelectedArtifact(artifact)
    setIsHistoryOpen(true)
  }

  return (
    <Card
      key={artifact.id}
      className="border-primary/20 hover:border-primary/50 cursor-pointer overflow-hidden transition-all"
      onClick={() => handleArtifactClick(artifact)}
    >
      <div
        className={`p-3 ${getArtifactRarityGradient(artifact.rarity as ArtifactRarity)} opacity-80`}
      >
        <div className="flex items-center justify-between">
          <h3 className="truncate font-bold">{artifact.name}</h3>
          <Badge variant="outline" className="text-primary/80 bg-white/70">
            {artifact.id}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Gem className="text-secondary mr-2 size-5" />
            <span className="text-primary font-medium">{artifact.rarity}</span>
          </div>
          <div className="text-primary text-xl font-bold">
            {formatCrowns(artifact.price)}
          </div>
        </div>

        <p className="text-primary/70 line-clamp-2 text-sm">
          {artifact.description}
        </p>

        <div className="text-primary/70 flex items-center justify-between text-xs">
          <div className="flex items-center">
            <Clock className="mr-1 size-3" />
            <span>
              Mis en vente le{" "}
              {formatDate(artifact.listedDate.toString(), locale)}
            </span>
          </div>
          <div className="flex items-center">
            <Eye className="mr-1 size-3" />
            <span>{artifact.views} vues</span>
          </div>
        </div>

        <div className="border-primary/10 flex items-end justify-between border-t">
          <div className="text-sm">
            Vendeur: <span className="font-medium">{artifact.seller}</span>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-secondary text-accent relative top-2"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedArtifact(artifact)
              setIsPurchaseModalOpen(true)
            }}
          >
            Acheter
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ArtifactListItem
