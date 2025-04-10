import { defaultPage } from "@lootopia/common"
import { Button, Dialog, DialogContent, DialogTitle } from "@lootopia/ui"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Flag, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

import ReportDetails from "./ReportDetails"
import ReportListSidebar from "./ReportListSidebar"
import { usePaginationObserver } from "@client/web/hooks/usePaginationObserver"
import {
  getUserReportList,
  type ReportResponse,
} from "@client/web/services/reports/getUserReportList"

type Props = {
  open: boolean
  setIsOpen: (open: boolean) => void
}

const ReportListDialog = ({ open, setIsOpen }: Props) => {
  const t = useTranslations("Components.Users.Reports.List.ReportDialog")

  const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(
    null
  )
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["reports", inputValue],
      queryFn: ({ pageParam = defaultPage }) =>
        getUserReportList({
          search: inputValue,
          page: pageParam.toString(),
        }),
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

  const filteredReports = (data?.pages.flatMap((page) => page?.result) ??
    []) as ReportResponse[]

  const handleSetValue = (query: string) => {
    setInputValue(query)

    checkIfShouldFetchNextPage()
  }

  const handleSelectReport = (report: ReportResponse) => {
    setSelectedReport(report)
  }

  const handleClosePopup = () => {
    setIsOpen(false)
    setSelectedReport(null)
    setInputValue("")
  }

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="border-primary bg-primaryBg h-[60vh] max-w-4xl overflow-hidden p-0">
        <div className="flex h-full flex-col">
          <div className="border-primary from-primary to-secondary flex items-center justify-between border-b bg-gradient-to-r p-6">
            <DialogTitle className="flex items-center text-white">
              <Flag className="mr-2 size-5" />
              {t("title")}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-accent rounded-full hover:bg-white/10 focus-visible:ring-0"
              onClick={handleClosePopup}
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="flex h-full">
            <ReportListSidebar
              inputValue={inputValue}
              onInputChange={handleSetValue}
              inputRef={inputRef}
              reports={filteredReports}
              selectedReport={selectedReport}
              onSelectReport={handleSelectReport}
              listContainerRef={listContainerRef}
              listRef={listRef}
            />

            <ReportDetails selectedReport={selectedReport} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReportListDialog
