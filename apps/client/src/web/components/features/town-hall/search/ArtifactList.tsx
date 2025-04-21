import { useState } from "react"

import ArtifactFilters from "./ArtifactFilters"
import ArtifactListItem from "./ArtifactListItem"
import { mockArtifacts, type ArtifactMocked } from "../mock-data"
import ArtifactOverview from "@client/web/components/features/town-hall/details/ArtifactOverview"

type Props = {
  selectedArtifact: ArtifactMocked | null
  setSelectedArtifact: (artifact: ArtifactMocked) => void
  setIsPurchaseModalOpen: (isOpen: boolean) => void
}

const ArtifacList = ({
  selectedArtifact,
  setSelectedArtifact,
  setIsPurchaseModalOpen,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("recent")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Filter artifacts based on search criteria
  const filteredArtifacts = mockArtifacts.filter((artifact) => {
    const matchesSearch =
      artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.seller.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRarity =
      selectedRarity === "all" || artifact.rarity === selectedRarity

    const matchesMinPrice =
      priceRange.min === "" || artifact.price >= Number.parseInt(priceRange.min)
    const matchesMaxPrice =
      priceRange.max === "" || artifact.price <= Number.parseInt(priceRange.max)

    return matchesSearch && matchesRarity && matchesMinPrice && matchesMaxPrice
  })

  // Sort artifacts
  const sortedArtifacts = [...filteredArtifacts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return b.listedDate.getTime() - a.listedDate.getTime()

      case "price-low":
        return a.price - b.price

      case "price-high":
        return b.price - a.price

      case "rarity":
        const rarityOrder = {
          legendary: 0,
          epic: 1,
          rare: 2,
          uncommon: 3,
          common: 4,
        }

        return (
          rarityOrder[a.rarity as keyof typeof rarityOrder] -
          rarityOrder[b.rarity as keyof typeof rarityOrder]
        )

      default:
        return 0
    }
  })

  return (
    <div className="flex h-full flex-col space-y-4">
      <ArtifactFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRarity={selectedRarity}
        setSelectedRarity={setSelectedRarity}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
      />

      <div className="text-primary/70 text-sm">
        {filteredArtifacts.length} artefacts trouvés
      </div>

      <div className="max-h-[47vh] flex-1 overflow-y-auto pb-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedArtifacts.map((artifact) => (
            <ArtifactListItem
              key={artifact.id}
              artifact={artifact}
              setSelectedArtifact={setSelectedArtifact}
              setIsPurchaseModalOpen={setIsPurchaseModalOpen}
              setIsHistoryOpen={setIsHistoryOpen}
            />
          ))}
        </div>
      </div>

      {selectedArtifact && (
        <ArtifactOverview
          selectedArtifact={selectedArtifact}
          open={isHistoryOpen}
          setIsOpen={setIsHistoryOpen}
          setIsPurchaseModalOpen={setIsPurchaseModalOpen}
        />
      )}
    </div>
  )
}

export default ArtifacList
