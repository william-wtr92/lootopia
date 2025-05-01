import { defaultLimit, defaultPage, historyStatus } from "@lootopia/common"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import { DollarSign, Compass, ArrowRight, Clock } from "lucide-react"
import { useState } from "react"

import EventDetails from "./EventDetails"
import EventTimeline from "./EventTimeline"
import { usePaginationObserver } from "@client/web/hooks/usePaginationObserver"
import {
  getUserArtifactHistory,
  type ArtifactHistoryResponse,
} from "@client/web/services/artifacts/getUserArtifactHistory"
import type { ArtifactOffersResponse } from "@client/web/services/town-hall/offers/getOffers"

type Props = {
  userArtifactId: ArtifactOffersResponse["offer"]["userArtifactId"]
}

const ArtifactHistory = ({ userArtifactId }: Props) => {
  const [selectedEvent, setSelectedEvent] =
    useState<ArtifactHistoryResponse | null>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["artifactHistory", userArtifactId],
      queryFn: ({ pageParam = defaultPage }) =>
        getUserArtifactHistory(
          { userArtifactId },
          { page: pageParam.toString(), limit: defaultLimit.toString() }
        ),
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
      enabled: !!userArtifactId,
    })

  const { containerRef: listContainerRef, sentinelRef: listRef } =
    usePaginationObserver({
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      threshold: 1,
    })

  const history = (data?.pages.flatMap((page) => page?.result) ??
    []) as ArtifactHistoryResponse[]

  const handleEventClick = (event: ArtifactHistoryResponse) => {
    setSelectedEvent(event)
  }

  return (
    <div className="flex h-[52vh] flex-col md:flex-row">
      <EventTimeline
        history={history}
        containerRef={listContainerRef}
        sentinelRef={listRef}
        selectedEvent={selectedEvent}
        onSelect={handleEventClick}
      />

      <EventDetails selectedEvent={selectedEvent} />
    </div>
  )
}

export default ArtifactHistory

export const getEventIcon = (type: ArtifactHistoryResponse["type"]) => {
  switch (type) {
    case historyStatus.discovery:
      return <Compass className="text-secondary size-5" />

    case historyStatus.transfer:
      return <ArrowRight className="text-secondary size-5" />

    case historyStatus.listing:
      return <DollarSign className="text-secondary size-5" />

    default:
      return <Clock className="text-secondary size-5" />
  }
}
