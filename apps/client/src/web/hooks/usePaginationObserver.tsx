import { useEffect, useRef } from "react"

type UsePaginationObserverProps = {
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

export const usePaginationObserver = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UsePaginationObserverProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sentinelRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0]

        if (lastEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1 }
    )

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const checkIfShouldFetchNextPage = () => {
    if (!containerRef.current) {
      return
    }

    const selected = containerRef.current.querySelector(
      '[aria-selected="true"]'
    )

    if (!selected) {
      return
    }

    const rect = selected.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    const isNearBottom = rect.bottom > containerRect.bottom - 30

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return {
    containerRef,
    sentinelRef,
    checkIfShouldFetchNextPage,
  }
}
