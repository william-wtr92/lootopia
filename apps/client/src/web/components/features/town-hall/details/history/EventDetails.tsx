import { Button } from "@lootopia/ui"
import { AnimatePresence, motion } from "framer-motion"
import {
  Calendar,
  Crown,
  DollarSign,
  MapPin,
  Sparkles,
  ViewIcon as View3d,
  User,
  History,
} from "lucide-react"
import { useLocale } from "next-intl"

import { getEventIcon } from "./ArtifactHistory"
import type { ArtifactHistoryResponse } from "@client/web/services/artifacts/getUserArtifactHistory"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"
import { formatDateTime } from "@client/web/utils/helpers/formatDate"

type Props = {
  selectedEvent: ArtifactHistoryResponse | null
  onVisualize: () => void
}

const EventDetails = ({ selectedEvent, onVisualize }: Props) => {
  const locale = useLocale()

  return (
    <div className="max-h-[60vh] w-full overflow-y-auto bg-white/30 p-6 md:max-h-[65vh] md:w-1/2">
      <AnimatePresence mode="wait">
        {selectedEvent ? (
          <motion.div
            key={selectedEvent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getEventIcon(selectedEvent.type)}
                <h3 className="text-primary ml-2 font-bold">
                  {selectedEvent.type}
                </h3>
              </div>
              {/* <Badge
                      className={getArtifactRarityColor(
                        selectedArtifact.rarity as ArtifactRarity
                      )}
                    >
                      {selectedArtifact.rarity}
                    </Badge> */}
            </div>

            <div className="border-primary/20 rounded-lg border bg-white/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="text-secondary mr-2 size-4" />
                  <span className="text-primary text-sm font-medium">Date</span>
                </div>
                <span className="text-primary/80">
                  {formatDateTime(selectedEvent.createdAt, locale)}
                </span>
              </div>

              {selectedEvent.type === "discovery" && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        Découvreur
                      </span>
                    </div>
                    <span className="text-primary/80">
                      {selectedEvent.newOwner}
                    </span>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        Lieu
                      </span>
                    </div>
                    <span className="text-primary/80">
                      {selectedEvent.huntCity}
                    </span>
                  </div>
                </>
              )}

              {selectedEvent.type === "transfer" && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        Vendeur
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
                        Acheteur
                      </span>
                    </div>
                    <span className="text-primary/80">
                      {selectedEvent.newOwner}
                    </span>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        Prix
                      </span>
                    </div>
                    <span className="text-primary/80 flex items-center font-bold">
                      {formatCrowns(selectedEvent.price!)}
                      <Crown className="text-primary ml-1 size-4" />
                    </span>
                  </div>
                </>
              )}

              {selectedEvent.type === "listing" && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        Vendeur
                      </span>
                    </div>
                    <span className="text-primary/80">
                      {selectedEvent.previousOwner}
                    </span>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="text-secondary mr-2 size-4" />
                      <span className="text-primary text-sm font-medium">
                        Prix demandé
                      </span>
                    </div>
                    <span className="text-primary/80 font-bold">
                      {formatCrowns(selectedEvent.price!)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {selectedEvent.type === "discovery" && (
              <div className="border-primary/20 rounded-lg border bg-white/70 p-4">
                <h4 className="text-primary mb-2 flex items-center font-medium">
                  <Sparkles className="text-secondary mr-2 size-4" />
                  Détails de l'événement
                </h4>
                <p className="text-primary/80 text-sm">
                  {selectedEvent.huntCity}
                </p>
              </div>
            )}

            {selectedEvent.type === "discovery" && (
              <div className="flex justify-center">
                <Button
                  className="bg-primary hover:bg-secondary text-accent"
                  onClick={() => onVisualize()}
                >
                  <View3d className="mr-2 size-4" /> Visualiser l'artefact
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <History className="text-secondary size-9" />
            <p className="text-primary/80 text-md">Sélectionnez un événement</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EventDetails
