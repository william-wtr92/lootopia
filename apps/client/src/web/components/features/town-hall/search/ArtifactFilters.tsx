import {
  Input,
  Button,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Collapsible,
  CollapsibleContent,
} from "@lootopia/ui"
import { ArrowUpDown, Filter, Search, X } from "lucide-react"

type Props = {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filtersOpen: boolean
  setFiltersOpen: (open: boolean) => void
  selectedRarity: string
  setSelectedRarity: (rarity: string) => void
  priceRange: { min: string; max: string }
  setPriceRange: (range: { min: string; max: string }) => void
  sortBy: string
  setSortBy: (sortBy: string) => void
}

const ArtifactFilters = ({
  searchTerm,
  setSearchTerm,
  filtersOpen,
  setFiltersOpen,
  selectedRarity,
  setSelectedRarity,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
}: Props) => {
  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedRarity("all")
    setPriceRange({ min: "", max: "" })
    setSortBy("recent")
  }

  return (
    <>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="text-primary/50 absolute left-2 top-2.5 size-4" />
          <Input
            placeholder="Rechercher un artefact, un vendeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-primary/30 text-primary focus:border-secondary focus:ring-secondary bg-white/50 pl-8"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="border-primary text-primary"
        >
          <Filter className="mr-2 size-4" />
          Filtres
        </Button>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="border-primary/30 text-primary w-[180px] bg-white/50">
            <div className="flex items-center">
              <ArrowUpDown className="mr-2 size-4" />
              <span>Trier par</span>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-primaryBg text-primary">
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="price-low">Prix croissant</SelectItem>
            <SelectItem value="price-high">Prix décroissant</SelectItem>
            <SelectItem value="rarity">Rareté</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleContent className="border-primary/20 space-y-4 rounded-md border bg-white/50 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[200px] flex-1">
              <label className="text-primary mb-1 block text-sm font-medium">
                Rareté
              </label>
              {/* TD: mutualize with inventory select */}
              <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                <SelectTrigger className="border-primary/30 text-primary w-full">
                  <SelectValue placeholder="Toutes raretés" />
                </SelectTrigger>
                <SelectContent className="bg-primaryBg text-primary">
                  <SelectItem value="all">Toutes raretés</SelectItem>
                  <SelectItem value="common">Commun</SelectItem>
                  <SelectItem value="uncommon">Peu commun</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Épique</SelectItem>
                  <SelectItem value="legendary">Légendaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[200px] flex-1">
              <label className="text-primary mb-1 block text-sm font-medium">
                Prix minimum
              </label>
              <Input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="border-primary/30"
              />
            </div>

            <div className="min-w-[200px] flex-1">
              <label className="text-primary mb-1 block text-sm font-medium">
                Prix maximum
              </label>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="border-primary/30"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="border-primary text-primary"
            >
              <X className="mr-2 size-4" />
              Effacer les filtres
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default ArtifactFilters
