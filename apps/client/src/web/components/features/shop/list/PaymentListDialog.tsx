import { defaultPage } from "@lootopia/common"
import { Button, Dialog, DialogContent, DialogTitle, Input } from "@lootopia/ui"
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query"
import { Loader2, Receipt, Search, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRef, useState } from "react"

import PaymentList from "./PaymentList"
import PaymentListExporter from "./PaymentListExporter"
import { usePaginationObserver } from "@client/web/hooks/usePaginationObserver"
import {
  getUserPaymentList,
  type PaymentResponse,
} from "@client/web/services/shop/getUserPaymentList"

type Props = {
  open: boolean
  setIsOpen: (open: boolean) => void
}

const PaymentListDialog = ({ open, setIsOpen }: Props) => {
  const t = useTranslations("Components.Shop.List.PaymentListDialog")

  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["payments", inputValue],
      queryFn: ({ pageParam = defaultPage }) =>
        getUserPaymentList({
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
  const filteredPayments = (data?.pages.flatMap((page) => page?.result) ??
    []) as PaymentResponse[]

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
      <DialogContent className="border-primary bg-primaryBg h-[60vh] max-w-4xl overflow-hidden p-0">
        <div className="flex h-full flex-col">
          <div className="border-primary/20 from-primary to-secondary flex items-center justify-between border-b bg-gradient-to-r px-4 py-3">
            <DialogTitle className="flex items-center text-white">
              <Receipt className="text-accent mr-2 size-5" />
              {t("title")}
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
                placeholder={t("search")}
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

          <PaymentList
            inputValue={inputValue}
            filteredPayments={filteredPayments}
            listContainerRef={listContainerRef}
            listRef={listRef}
          />

          <PaymentListExporter count={count} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentListDialog
