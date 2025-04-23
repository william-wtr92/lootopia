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
import type { ArtifactOffersResponse } from "@client/web/services/town-hall/getOffers"

type Props = {
  selectedArtifact: ArtifactOffersResponse
}

const ArtifactHistory = ({ selectedArtifact }: Props) => {
  const [selectedEvent, setSelectedEvent] =
    useState<ArtifactHistoryResponse | null>(null)
  const [, setShowVisualization] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["artifactHistory", selectedArtifact.offer.userArtifactId],
      queryFn: ({ pageParam = defaultPage }) =>
        getUserArtifactHistory(
          { userArtifactId: selectedArtifact.offer.userArtifactId },
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
      enabled: !!selectedArtifact?.offer?.userArtifactId,
    })

  const { containerRef: listContainerRef, sentinelRef: listRef } =
    usePaginationObserver({ fetchNextPage, hasNextPage, isFetchingNextPage })

  const history = (data?.pages.flatMap((page) => page?.result) ??
    []) as ArtifactHistoryResponse[]

  const handleVisualize = () => {
    setShowVisualization(true)
  }

  const handleEventClick = (event: ArtifactHistoryResponse) => {
    setSelectedEvent(event)
  }

  return (
    <div className="flex h-full flex-col md:flex-row">
      <EventTimeline
        history={history}
        containerRef={listContainerRef}
        sentinelRef={listRef}
        selectedEvent={selectedEvent}
        onSelect={handleEventClick}
      />

      <EventDetails
        selectedEvent={selectedEvent}
        onVisualize={handleVisualize}
      />
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
