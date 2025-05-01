import {
  defaultLimit,
  defaultPage,
  offerFilters,
  type ArtifactRarity,
  type OfferFilters,
} from "@lootopia/common"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import { Gem } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import ArtifactFilters from "./ArtifactFilters"
import ArtifactListItem from "./ArtifactListItem"
import ArtifactOverview from "@client/web/components/features/town-hall/details/ArtifactOverview"
import { usePaginationObserver } from "@client/web/hooks/usePaginationObserver"
import {
  getOffers,
  type ArtifactOffersResponse,
} from "@client/web/services/town-hall/offers/getOffers"

type Props = {
  artifactOffer: ArtifactOffersResponse | null
  setSelectedArtifact: (artifact: ArtifactOffersResponse) => void
  setIsPurchaseModalOpen: (isOpen: boolean) => void
}

const ArtifactList = ({
  artifactOffer,
  setSelectedArtifact,
  setIsPurchaseModalOpen,
}: Props) => {
  const t = useTranslations("Components.TownHall.Search.ArtifactList")

  const [inputValue, setInputValue] = useState("")
  const [submittedValue, setSubmittedValue] = useState("")
  const [tempSelectedRarity, setTempSelectedRarity] = useState<
    ArtifactRarity | "all"
  >("all")
  const [tempPriceRange, setTempPriceRange] = useState({ min: "", max: "" })
  const [selectedRarity, setSelectedRarity] = useState<ArtifactRarity | "all">(
    "all"
  )
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState<OfferFilters>(offerFilters.latest)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        "artifactOffers",
        submittedValue,
        selectedRarity,
        priceRange,
        sortBy,
      ],
      queryFn: () =>
        getOffers({
          page: defaultPage.toString(),
          limit: defaultLimit.toString(),
          search: submittedValue,
          filters: selectedRarity === "all" ? undefined : selectedRarity,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          sortBy,
        }),

      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage) {
          return undefined
        }

        return allPages.length - 1 < lastPage.lastPage
          ? allPages.length
          : undefined
      },
      initialPageParam: defaultPage,
      placeholderData: keepPreviousData,
    })

  const {
    containerRef: listContainerRef,
    sentinelRef: listRef,
    checkIfShouldFetchNextPage,
  } = usePaginationObserver({ fetchNextPage, hasNextPage, isFetchingNextPage })

  const countResult = data?.pages[0]?.countResult ?? 0
  const artifactOffers = (data?.pages.flatMap((page) => page?.result) ??
    []) as ArtifactOffersResponse[]

  const handleSetInputValue = (query: string) => {
    setInputValue(query)
  }

  const handleSubmitInputValue = (query: string) => {
    setSubmittedValue(query)

    checkIfShouldFetchNextPage()
  }

  const handleSelectTempRarity = (rarity: ArtifactRarity | "all") => {
    setTempSelectedRarity(rarity)
  }

  const handleSelectTempPriceRange = (range: { min: string; max: string }) => {
    setTempPriceRange(range)
  }

  const handleSelectSortBy = (sort: OfferFilters) => {
    setSortBy(sort)
  }

  const handleApplyFilters = () => {
    setSelectedRarity(tempSelectedRarity)
    setPriceRange(tempPriceRange)

    checkIfShouldFetchNextPage()
  }

  const handleClearFilters = () => {
    setTempSelectedRarity("all")
    setTempPriceRange({ min: "", max: "" })
    setSelectedRarity("all")
    setPriceRange({ min: "", max: "" })
    setSortBy(offerFilters.latest)

    checkIfShouldFetchNextPage()
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <ArtifactFilters
        inputValue={inputValue}
        setInputValue={handleSetInputValue}
        onSubmitInputValue={handleSubmitInputValue}
        selectedRarity={tempSelectedRarity}
        setSelectedRarity={handleSelectTempRarity}
        priceRange={tempPriceRange}
        setPriceRange={handleSelectTempPriceRange}
        sortBy={sortBy}
        setSortBy={handleSelectSortBy}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      <div className="text-primary/70 text-sm">
        {t("count", { count: countResult })}
      </div>

      <div
        className="max-h-[47vh] flex-1 overflow-y-auto pb-4"
        ref={listContainerRef}
      >
        <div className="h-full">
          {artifactOffers && artifactOffers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {artifactOffers.map((artifactOffer, i) => (
                <ArtifactListItem
                  key={i}
                  artifactOffer={artifactOffer}
                  setSelectedArtifact={setSelectedArtifact}
                  setIsPurchaseModalOpen={setIsPurchaseModalOpen}
                  setIsHistoryOpen={setIsHistoryOpen}
                />
              ))}
            </div>
          ) : (
            <div className="text-primary/70 border-primary/10 flex h-full flex-col items-center justify-center gap-4 rounded-lg border bg-white/30">
              <Gem className="mr-2 size-12 opacity-20" />
              <span className="text-md">
                {t("empty", {
                  count: countResult,
                })}
              </span>
            </div>
          )}

          <div id="sentinel" ref={listRef} className="h-1" />
        </div>
      </div>

      {artifactOffer && (
        <ArtifactOverview
          artifactOffer={artifactOffer}
          open={isHistoryOpen}
          setIsOpen={setIsHistoryOpen}
          setIsPurchaseModalOpen={setIsPurchaseModalOpen}
        />
      )}
    </div>
  )
}

export default ArtifactList
