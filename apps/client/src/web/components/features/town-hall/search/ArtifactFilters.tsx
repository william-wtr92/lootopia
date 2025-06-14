import {
  offerFilters,
  type OfferFilters,
  type ArtifactRarity,
} from "@lootopia/common"
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
import { ArrowRight, ArrowUpDown, Filter, Search, X } from "lucide-react"
import { useTranslations } from "next-intl"

import SelectArtifactRarity from "@client/web/components/features/artifacts/utils/SelectArtifactRarity"

type Props = {
  inputValue: string
  setInputValue: (term: string) => void
  onSubmitInputValue: (term: string) => void
  filtersOpen: boolean
  setFiltersOpen: (open: boolean) => void
  selectedRarity: ArtifactRarity | "all"
  setSelectedRarity: (rarity: ArtifactRarity | "all") => void
  priceRange: { min: string; max: string }
  setPriceRange: (range: { min: string; max: string }) => void
  sortBy: OfferFilters
  setSortBy: (sortBy: OfferFilters) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

const ArtifactFilters = ({
  inputValue,
  setInputValue,
  onSubmitInputValue,
  filtersOpen,
  setFiltersOpen,
  selectedRarity,
  setSelectedRarity,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  onApplyFilters,
  onClearFilters,
}: Props) => {
  const t = useTranslations("Components.TownHall.Search.ArtifactFilters")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmitInputValue(inputValue)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="text-primary/50 absolute left-2 top-2.5 size-4" />
          <Input
            placeholder={t("search.placeholder")}
            className="border-primary/30 text-primary placeholder-primary/40 focus:border-secondary focus:ring-secondary bg-white/50 pl-8 pr-10"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {inputValue.length > 0 && (
            <div className="absolute right-2 top-2 flex items-center space-x-1">
              <div
                className="text-primary/70 rounded px-1 py-0.5 text-xs"
                title={t("search.press")}
              >
                <span className="flex items-center gap-1">
                  <span>{t("search.label")}</span>
                  <ArrowRight className="size-3" />
                </span>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="border-primary text-primary"
        >
          <Filter className="mr-2 size-4" />
          {t("filters.label")}
        </Button>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="border-primary/30 text-primary w-[180px] bg-white/50">
            <ArrowUpDown className="mr-2 size-4" />
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent className="bg-primaryBg text-primary">
            <SelectItem value={offerFilters.latest}>
              {t("filters.options.latest")}
            </SelectItem>
            <SelectItem value={offerFilters.priceAsc}>
              {t("filters.options.priceAsc")}
            </SelectItem>
            <SelectItem value={offerFilters.priceDesc}>
              {t("filters.options.priceDesc")}
            </SelectItem>
            <SelectItem value={offerFilters.rarity}>
              {t("filters.options.rarity")}
            </SelectItem>
            <SelectItem value={offerFilters.favorites}>
              {t("filters.options.favorites")}
            </SelectItem>
            <SelectItem value={offerFilters.mine}>
              {t("filters.options.mine")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleContent className="border-primary/20 space-y-4 rounded-md border bg-white/50 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[200px] flex-1">
              <label className="text-primary mb-1 block text-sm font-medium">
                {t("advancedFilters.rarity.label")}
              </label>

              <SelectArtifactRarity
                selectedRarity={selectedRarity}
                setSelectedRarity={setSelectedRarity}
              />
            </div>

            <div className="min-w-[200px] flex-1">
              <label className="text-primary mb-1 block text-sm font-medium">
                {t("advancedFilters.price.min.label")}
              </label>
              <Input
                type="number"
                placeholder={t("advancedFilters.price.min.placeholder")}
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="border-primary/30 text-primary"
              />
            </div>

            <div className="min-w-[200px] flex-1">
              <label className="text-primary mb-1 block text-sm font-medium">
                {t("advancedFilters.price.max.label")}
              </label>
              <Input
                type="number"
                placeholder={t("advancedFilters.price.max.placeholder")}
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="border-primary/30 text-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="border-primary text-primary"
            >
              <X className="mr-2 size-2" />
              {t("cta.clear")}
            </Button>
            <Button size="sm" onClick={onApplyFilters}>
              {t("cta.apply")}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default ArtifactFilters
