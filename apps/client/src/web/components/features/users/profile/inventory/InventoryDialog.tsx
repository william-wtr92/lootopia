"use client"

import type { ArtifactRarity } from "@common/artifacts"
import { artifactRarity, defaultLimit, defaultPage } from "@common/index"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@lootopia/ui"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Trophy, Search, Gem, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRef, useState } from "react"

import InventoryArtifactList from "./InventoryArtifactList"
import InventoryBadgeList from "./InventoryBadgeList"
import { usePrefetchNextPage } from "@client/web/hooks/usePrefetchNextPage"
import { getArtifactInventory } from "@client/web/services/artifacts/getArtifactInventory"

type Props = {
  open: boolean
  setIsOpen: (open: boolean) => void
}

const InventoryDialog = ({ open, setIsOpen }: Props) => {
  const t = useTranslations(
    "Components.Users.Profile.Inventory.InventoryDialog"
  )

  const [activeTab, setActiveTab] = useState("artifacts")
  const [inputValue, setInputValue] = useState("")
  const [submittedValue, setSubmittedValue] = useState("")
  const [currentPage, setCurrentPage] = useState(defaultPage)
  const [selectedRarity, setSelectedRarity] = useState<ArtifactRarity | "all">(
    "all"
  )

  const searchInputRef = useRef<HTMLInputElement>(null)

  const { data, isFetching, isError, isLoading } = useQuery({
    queryKey: [
      "artifactInventory",
      submittedValue,
      selectedRarity,
      currentPage,
    ],
    queryFn: () =>
      getArtifactInventory({
        page: currentPage.toString(),
        limit: defaultLimit.toString(),
        search: submittedValue,
        filters: selectedRarity === "all" ? undefined : selectedRarity,
      }),
    enabled: open,
    placeholderData: keepPreviousData,
  })

  const items = data?.result ?? []
  const lastPage = data?.lastPage ?? defaultPage

  usePrefetchNextPage({
    enabled: open,
    currentPage,
    lastPage,
    queryKeyBase: (nextPage) => [
      "artifactInventory",
      submittedValue,
      selectedRarity,
      nextPage,
    ],
    queryFn: (nextPage) =>
      getArtifactInventory({
        page: nextPage.toString(),
        limit: defaultLimit.toString(),
        search: submittedValue,
        filters: selectedRarity === "all" ? undefined : selectedRarity,
      }),
    isFetching,
  })

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, defaultPage))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, lastPage))
  }

  const handleSetValue = (value: string) => {
    setInputValue(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSubmittedValue(inputValue)
      setCurrentPage(defaultPage)
      setSelectedRarity("all")
    }
  }

  const handleClearSearch = () => {
    setInputValue("")
    setSubmittedValue("")
    setCurrentPage(defaultPage)
    setSelectedRarity("all")
    searchInputRef.current?.focus()
  }

  const handleSetRarity = (value: ArtifactRarity | "all") => {
    setSelectedRarity(value)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent className="p-6 sm:max-w-[600px]">
          <DialogHeader className="text-primary">
            <DialogTitle className="flex items-center text-xl font-bold">
              <Gem className="text-secondary mr-2 size-5" />
              {t("title")}
            </DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <div className="mb-4 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="text-primary/50 absolute left-2 top-2.5 size-4" />
              <Input
                ref={searchInputRef}
                placeholder={t("search.placeholder")}
                className="border-primary/30 text-primary placeholder-primary/40 focus:border-secondary focus:ring-secondary bg-white/50 pl-8 pr-10"
                value={inputValue}
                onChange={(e) => handleSetValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {inputValue.length > 0 && (
                <div className="absolute right-2 top-2 flex items-center space-x-1">
                  <div
                    className="text-primary/70 rounded px-1 py-0.5 text-xs"
                    title="Appuyez sur Entrée pour rechercher"
                  >
                    <span className="flex items-center">
                      <span>{t("search.enter")}</span>
                      <ArrowRight className="ml-1 size-3" />
                    </span>
                  </div>
                </div>
              )}
            </div>
            {activeTab === "artifacts" && (
              <div className="flex items-center space-x-1">
                <Select onValueChange={handleSetRarity} value={selectedRarity}>
                  <SelectTrigger className="bg-primary text-accent primary border-l-primary h-full w-[170px] select-none border-l-2 px-3 font-medium outline-0 ring-0 focus:ring-0">
                    <SelectValue placeholder={t("filters.trigger")} />
                  </SelectTrigger>
                  <SelectContent className="text-primary bg-primaryBg h-full text-center font-medium outline-0">
                    <SelectItem value="all">
                      {t("filters.options.all")}
                    </SelectItem>
                    <SelectItem value={artifactRarity.common}>
                      {t("filters.options.common")}
                    </SelectItem>
                    <SelectItem value={artifactRarity.uncommon}>
                      {t("filters.options.uncommon")}
                    </SelectItem>
                    <SelectItem value={artifactRarity.rare}>
                      {t("filters.options.rare")}
                    </SelectItem>
                    <SelectItem value={artifactRarity.epic}>
                      {t("filters.options.epic")}
                    </SelectItem>
                    <SelectItem value={artifactRarity.legendary}>
                      {t("filters.options.legendary")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Tabs
            defaultValue="artifacts"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-2"
          >
            <TabsList className="text-primary grid w-full grid-cols-2">
              <TabsTrigger
                value="artifacts"
                className="data-[state=active]:text-primary/70 flex items-center"
              >
                <Gem className="mr-2 size-4" />
                {t("tabs.triggers.artifacts")}
              </TabsTrigger>
              <TabsTrigger
                value="badges"
                className="data-[state=active]:text-primary/70 flex items-center"
              >
                <Trophy className="mr-2 size-4" />
                {t("tabs.triggers.badges")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="artifacts" className="mt-4">
              <InventoryArtifactList
                inputValue={inputValue}
                onClearSearch={handleClearSearch}
                items={items}
                currentPage={currentPage}
                lastPage={lastPage}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                isLoading={isLoading || isFetching}
                isError={isError}
              />
            </TabsContent>

            <TabsContent value="badges" className="mt-4">
              <InventoryBadgeList inputValue={inputValue} />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              onClick={() => setIsOpen(false)}
              className="hover:bg-secondary bg-primary text-accent"
            >
              {t("cta.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default InventoryDialog
