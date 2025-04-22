import { defaultPage, type ArtifactRarity } from "@lootopia/common"
import { Button } from "@lootopia/ui"
import { ChevronLeft, ChevronRight, Gem } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import InventoryArtifactDetails from "./InventoryArtifactDetails"
import type { ArtifactInventoryResponse } from "@client/web/services/artifacts/getArtifactInventory"
import { getArtifactRarityColor } from "@client/web/utils/def/colors"
import { formatDate } from "@client/web/utils/helpers/formatDate"

type Props = {
  inputValue: string
  onClearSearch: () => void
  items: ArtifactInventoryResponse[]
  currentPage: number
  lastPage: number
  handlePreviousPage: () => void
  handleNextPage: () => void
  isLoading: boolean
  isError: boolean
  isFetching?: boolean
}

const InventoryArtifactList = ({
  inputValue,
  onClearSearch,
  items,
  currentPage,
  lastPage,
  handlePreviousPage,
  handleNextPage,
  isLoading,
  isError,
  isFetching = false,
}: Props) => {
  const t = useTranslations(
    "Components.Users.Profile.Inventory.InventoryArtifactList"
  )
  const locale = useLocale()

  const [selectedItem, setSelectedItem] =
    useState<ArtifactInventoryResponse | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleItemClick = (item: ArtifactInventoryResponse) => {
    setSelectedItem(item)
    setIsDetailOpen(true)
  }

  if (isLoading) {
    return <div className="text-primary py-8 text-center">{t("loading")}</div>
  }

  return (
    <>
      <div className="max-h-[350px] min-h-[300px] space-y-3 overflow-y-auto">
        {items.length === 0 || isError ? (
          <div className="border-primary/10 text-primary/50 rounded-lg border bg-white/30 py-8 text-center">
            <Gem className="mx-auto mb-2 size-12 opacity-20" />
            <p>{t("empty")}</p>
            {inputValue && (
              <Button
                variant="link"
                onClick={onClearSearch}
                className="text-secondary mt-2"
              >
                {t("clear")}
              </Button>
            )}
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={i}
              className="hover:bg-primaryBg flex cursor-pointer items-center justify-between rounded-md border p-3"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`rounded-full p-2 ${getArtifactRarityColor(item?.artifact?.rarity as ArtifactRarity)}`}
                >
                  <Gem className="size-5" />
                </div>
                <div>
                  <h3 className="text-primary font-medium">
                    {item?.artifact?.name}
                  </h3>
                  <div className="text-primary/40 mt-1 flex items-center text-xs">
                    <span className="mr-2 w-24 truncate">
                      {t("artifacts.shaKey", {
                        shaKey: item?.artifact?.shaKey,
                      })}
                    </span>
                    <span>
                      {t("artifacts.obtainedAt", {
                        date: formatDate(item.obtainedAt, locale),
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${getArtifactRarityColor(item?.artifact?.rarity as ArtifactRarity)}`}
                >
                  {item?.artifact?.rarity}
                </span>
                <span className="text-primary text-xs font-semibold">
                  {item.huntName}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && !isError && items.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === defaultPage}
            className="border-primary text-primary"
          >
            <ChevronLeft className="mr-1 size-4" />
            {t("pagination.previous")}
          </Button>

          <span className="text-primary/50 text-sm">
            {t("pagination.page", {
              page: currentPage + 1,
              total: lastPage + 1,
            })}
            {isFetching && t("pagination.fetching")}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= lastPage}
            className="border-primary text-primary"
          >
            {t("pagination.next")}
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      )}

      {selectedItem && (
        <InventoryArtifactDetails
          item={selectedItem}
          open={isDetailOpen}
          setIsOpen={setIsDetailOpen}
        />
      )}
    </>
  )
}

export default InventoryArtifactList
