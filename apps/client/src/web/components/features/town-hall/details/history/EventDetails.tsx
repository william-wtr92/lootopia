import { historyStatus } from "@lootopia/common"
import { AnimatePresence, motion } from "framer-motion"
import {
  Calendar,
  Crown,
  DollarSign,
  MapPin,
  Sparkles,
  User,
  History,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { getEventIcon } from "./ArtifactHistory"
import type { ArtifactHistoryResponse } from "@client/web/services/artifacts/getUserArtifactHistory"
import anim from "@client/web/utils/anim"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"
import { formatDateTime } from "@client/web/utils/helpers/formatDate"

type Props = {
  selectedEvent: ArtifactHistoryResponse | null
}

const EventDetails = ({ selectedEvent }: Props) => {
  const t = useTranslations("Components.TownHall.Details.History.EventDetails")
  const locale = useLocale()

  return (
    <div className="h-full w-full bg-white/30 p-6 md:w-1/2">
      <AnimatePresence mode="wait">
        {selectedEvent ? (
          <motion.div
            key={selectedEvent.id}
            {...anim(eventCardVariants)}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getEventIcon(selectedEvent.type)}
                <h3 className="text-primary ml-2 font-bold">
                  {t(`eventTypes.${selectedEvent.type}`)}
                </h3>
              </div>
            </div>

            <div className="border-primary/20 rounded-lg border bg-white/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="text-secondary mr-2 size-4" />
                  <span className="text-primary text-sm font-medium">
                    {t("date")}
                  </span>
                </div>
                <span className="text-primary/80">
                  {formatDateTime(selectedEvent.createdAt, locale)}
                </span>
              </div>

              {selectedEvent.type === historyStatus.discovery && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        {t("discovery.discoverer")}
                      </span>
                    </div>
                    <span className="text-primary/80">
                      {selectedEvent.newOwner}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        {t("discovery.origin")}
                      </span>
                    </div>
                    <span className="text-primary/80">
                      {selectedEvent.huntCity}
                    </span>
                  </div>
                </>
              )}

              {selectedEvent.type === historyStatus.transfer && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        {t("transfer.seller")}
                      </span>
                    </div>
                    <span className="text-primary/80">
                      {selectedEvent.previousOwner}
                    </span>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        {t("transfer.buyer")}
                      </span>
                    </div>
                    <span className="text-primary/80">
                      {selectedEvent.newOwner}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        {t("transfer.price")}
                      </span>
                    </div>
                    <span className="text-primary/80 flex items-center font-bold">
                      {formatCrowns(selectedEvent.price!)}
                      <Crown className="text-primary ml-1 size-4" />
                    </span>
                  </div>
                </>
              )}

              {selectedEvent.type === historyStatus.listing && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        {t("listing.seller")}
                      </span>
                    </div>
                    <span className="text-primary/80">
                      {selectedEvent.previousOwner}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        {t("listing.askingPrice")}
                      </span>
                    </div>
                    <span className="text-primary/80 font-bold">
                      {formatCrowns(selectedEvent.price!)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {selectedEvent.type === historyStatus.discovery && (
              <div className="border-primary/20 rounded-lg border bg-white/70 p-4">
                <h4 className="text-primary mb-2 flex items-center font-medium">
                  <Sparkles className="text-secondary mr-2 size-4" />
                  {t("discovery.details")}
                </h4>
                <p className="text-primary/80 text-sm">
                  {selectedEvent.huntCity}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <History className="text-secondary size-9" />
            <p className="text-primary/80 text-md">{t("noEventSelected")}</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EventDetails

const eventCardVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}
