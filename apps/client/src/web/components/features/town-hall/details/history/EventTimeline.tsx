import { historyStatus } from "@lootopia/common"
import { motion } from "framer-motion"
import { History, Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { getEventIcon } from "./ArtifactHistory"
import type { ArtifactHistoryResponse } from "@client/web/services/artifacts/getUserArtifactHistory"
import anim from "@client/web/utils/anim"
import { getArtifactHistoryEventColor } from "@client/web/utils/def/colors"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"
import { formatDate } from "@client/web/utils/helpers/formatDate"

type Props = {
  history: ArtifactHistoryResponse[]
  containerRef: React.RefObject<HTMLDivElement | null>
  sentinelRef: React.RefObject<HTMLDivElement | null>
  selectedEvent: ArtifactHistoryResponse | null
  onSelect: (event: ArtifactHistoryResponse) => void
}

const EventTimeline = ({
  history,
  containerRef,
  sentinelRef,
  selectedEvent,
  onSelect,
}: Props) => {
  const t = useTranslations("Components.TownHall.Details.History.EventTimeline")
  const locale = useLocale()

  return (
    <div className="border-primary/10 h-full w-full border-r px-6 md:w-1/2">
      <h3 className="text-primary mb-4 flex items-center font-bold">
        <History className="text-secondary mr-2 size-5" />
        {t("title")}
      </h3>

      <div
        ref={containerRef}
        className="relative max-h-[50vh] space-y-6 overflow-y-auto pb-8 pl-8 pt-4"
      >
        <svg
          className="top-50 fixed left-[42px] min-h-[50vh]"
          width="24"
          height="100%"
          viewBox="0 0 24 1000"
          fill="none"
          preserveAspectRatio="none"
        >
          <line
            x1="12"
            y1="0"
            x2="12"
            y2="1000"
            stroke="#8A4FFF"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>
        {history.map((event, index) => (
          <motion.div
            key={index}
            className="relative flex items-center justify-center"
            {...anim(eventItemVariants(index))}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            onClick={() => onSelect(event)}
          >
            <div
              className={`border-secondary/80 absolute -left-[30px] rounded-full border-2 bg-[#F8F0E3] p-1 ${selectedEvent === event ? "border-secondary" : "border-primary/40"}`}
            >
              {getEventIcon(event.type)}
            </div>

            <div
              className={`${getArtifactHistoryEventColor(event.type)} w-[95%] cursor-pointer rounded-lg border p-4 transition-all ${
                selectedEvent === event
                  ? "border-primary scale-[1.02] transform shadow-md"
                  : "hover:border-primary/30 border-transparent hover:shadow-sm"
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-primary font-medium">
                  {t(`eventTypes.${event.type}`)}
                </h3>
                <span className="text-primary/70 text-sm">
                  {formatDate(event.createdAt, locale)}
                </span>
              </div>

              <p className="text-primary/80 mb-1 text-sm">
                {event.type === historyStatus.discovery ? (
                  <span>
                    {t.rich("discovered", {
                      newOwner: event.newOwner,
                      city: event.huntCity,
                      strong: (children) => (
                        <span className="font-bold">{children}</span>
                      ),
                    })}
                  </span>
                ) : event.type === historyStatus.transfer ? (
                  <span>
                    {t.rich("transferred", {
                      oldOwner: event.previousOwner,
                      newOwner: event.newOwner,
                      strong: (children) => (
                        <span className="font-bold">{children}</span>
                      ),
                    })}
                  </span>
                ) : (
                  event.type === historyStatus.listing && (
                    <span>
                      {t.rich("listed", {
                        seller: event.previousOwner,
                        price: formatCrowns(event.price!),
                        strong: (children) => (
                          <span className="font-bold">{children}</span>
                        ),
                      })}
                    </span>
                  )
                )}
              </p>

              {selectedEvent === event && (
                <div className="text-primary/60 mt-2 flex items-center text-xs">
                  <Search className="mr-1 size-3" />
                  <span>{t("cta.viewDetails")}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        <div id="sentinel" ref={sentinelRef} className="h-1" />
      </div>
    </div>
  )
}

export default EventTimeline

const eventItemVariants = (index: number) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.1, delay: index * 0.025 },
})
