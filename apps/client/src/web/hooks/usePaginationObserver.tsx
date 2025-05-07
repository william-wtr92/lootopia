import { useEffect, useRef } from "react"

type UsePaginationObserverProps = {
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  threshold?: number
}

export const usePaginationObserver = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  threshold,
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
      { root: containerRef.current, threshold: threshold ?? 0.5 }
    )

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, threshold])

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
