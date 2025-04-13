import { defaultPage } from "@lootopia/common"
import { Button, Dialog, DialogContent, DialogTitle, Input } from "@lootopia/ui"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import { ListPlus, Loader2, Search, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRef, useState } from "react"

import ParticipationRequestList from "./ParticipationRequestList"
import { usePaginationObserver } from "@client/web/hooks/usePaginationObserver"
import type { HuntResponse } from "@client/web/services/hunts/getHunts"
import {
  type RequestResponse,
  getParticipationRequestList,
} from "@client/web/services/participations/getParticipationRequestList"

type Props = {
  open: boolean
  setIsOpen: (open: boolean) => void
  hunt: HuntResponse
}

const ParticipationRequestListDialog = ({ open, setIsOpen, hunt }: Props) => {
  const t = useTranslations(
    "Components.Hunts.List.Participations.ParticipationRequestListDialog"
  )

  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["requests", inputValue],
      queryFn: ({ pageParam = defaultPage }) =>
        getParticipationRequestList(
          { huntId: hunt.id },
          {
            search: inputValue,
            page: pageParam.toString(),
          }
        ),
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage) {
          return undefined
        }

        return allPages.length - 1 < lastPage.lastPage
          ? allPages.length
          : undefined
      },
      enabled: open,
      initialPageParam: defaultPage,
      placeholderData: keepPreviousData,
    })

  const {
    containerRef: listContainerRef,
    sentinelRef: listRef,
    checkIfShouldFetchNextPage,
  } = usePaginationObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  })

  const count = data?.pages[0]?.count || 0
  const filteredRequests = (data?.pages.flatMap((page) => page?.result) ??
    []) as RequestResponse[]

  const handleSetValue = (query: string) => {
    setInputValue(query)

    checkIfShouldFetchNextPage()
  }

  const handleClosePopup = () => {
    setIsOpen(false)
    setInputValue("")
  }

  const handleClearInput = () => {
    setInputValue("")

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="border-primary bg-primaryBg h-[60vh] max-w-4xl overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="border-primary/20 from-primary to-secondary flex items-center justify-between border-b bg-gradient-to-r px-4 py-3">
            <DialogTitle className="flex items-center gap-2 text-white">
              <ListPlus className="text-accent mr-2 size-5" />
              {t("title", {
                huntName: hunt.name,
              })}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white ring-0 hover:bg-white/10 focus-visible:ring-0"
              onClick={handleClosePopup}
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="border-primary/20 bg-primaryBg border-b p-4">
            <div className="border-primary/20 flex items-center rounded-md border bg-white/10 px-3 py-2">
              <Search className="text-primary mr-2 size-4 flex-shrink-0" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={t("searchPlaceholder")}
                className="text-primary placeholder:text-primary/50 w-full border-none bg-transparent shadow-none focus-visible:ring-0"
                value={inputValue}
                onChange={(e) => handleSetValue(e.target.value)}
              />
              {isFetchingNextPage || isFetching ? (
                <Loader2 className="text-primary ml-2 size-4 animate-spin" />
              ) : (
                inputValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary size-5 flex-shrink-0 rounded-full p-0"
                    onClick={handleClearInput}
                  >
                    <X className="size-3" />
                  </Button>
                )
              )}
            </div>
          </div>

          <ParticipationRequestList
            filteredRequests={filteredRequests}
            listContainerRef={listContainerRef}
            listRef={listRef}
            huntId={hunt.id}
          />

          <div className="border-primary/20 bg-primaryBg flex h-16 items-center border-t px-4">
            <div className="text-primary text-md flex items-center gap-1">
              <span className="font-medium">{count}</span>
              <span className="text-primary/50">{t("pendingRequests")}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default ParticipationRequestListDialog
