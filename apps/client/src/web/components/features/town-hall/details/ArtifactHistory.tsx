import type { ArtifactRarity } from "@lootopia/common"
import { Button, Badge } from "@lootopia/ui"
import { motion, AnimatePresence } from "framer-motion"
import {
  History,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Sparkles,
  Search,
  ViewIcon as View3d,
  Crown,
  Compass,
  ArrowRight,
  Clock,
} from "lucide-react"
import { useLocale } from "next-intl"
import { useEffect, useRef, useState } from "react"

import {
  type ArtifactHistoryEventMocked,
  generateMockHistory,
  type ArtifactMocked,
} from "../mock-data"
import {
  getArtifactHistoryEventColor,
  getArtifactRarityColor,
} from "@client/web/utils/def/colors"
import { formatCrowns } from "@client/web/utils/helpers/formatCrowns"
import {
  formatDate,
  formatDateTime,
} from "@client/web/utils/helpers/formatDate"

type Props = {
  selectedArtifact: ArtifactMocked
}

const ArtifactHistory = ({ selectedArtifact }: Props) => {
  const locale = useLocale()

  const timelineRef = useRef(null)

  const [history, setHistory] = useState<ArtifactHistoryEventMocked[]>([])
  const [selectedEvent, setSelectedEvent] =
    useState<ArtifactHistoryEventMocked | null>(null)
  const [, setShowVisualization] = useState(false)

  const handleVisualize = () => {
    setShowVisualization(true)
  }

  const handleEventClick = (event: ArtifactHistoryEventMocked) => {
    setSelectedEvent(event)
  }

  useEffect(() => {
    if (selectedArtifact) {
      const generatedHistory = generateMockHistory(selectedArtifact)
      setHistory(generatedHistory)
      setSelectedEvent(generatedHistory[generatedHistory.length - 1])
    }
  }, [selectedArtifact])

  return (
    <div className="flex h-full flex-col md:flex-row">
      <div
        className="border-primary/10 max-h-[60vh] w-full overflow-y-auto border-r p-6 md:max-h-[65vh] md:w-1/2"
        ref={timelineRef}
      >
        <h3 className="text-primary mb-4 flex items-center font-bold">
          <History className="text-secondary mr-2 size-5" />
          Parcours de l'artefact
        </h3>

        <div className="border-primary/20 relative space-y-6 border-l-2 py-2 pl-8">
          {history.map((event, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleEventClick(event)}
            >
              <div
                className={`absolute -left-[33px] rounded-full border-2 bg-[#F8F0E3] p-1 ${selectedEvent === event ? "border-primary" : "border-primary/20"}`}
              >
                {getEventIcon(event.type)}
              </div>

              <div
                className={`${getArtifactHistoryEventColor(event.type)} cursor-pointer rounded-lg border p-4 transition-all ${
                  selectedEvent === event
                    ? "border-primary scale-[1.02] transform shadow-md"
                    : "hover:border-primary/30 border-transparent hover:shadow-sm"
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-primary font-medium">{event.type}</h3>
                  <span className="text-primary/70 text-sm">
                    {formatDate(event.date.toString(), locale)}
                  </span>
                </div>

                <p className="text-primary/80 mb-1 text-sm">
                  {event.description}
                </p>

                {selectedEvent === event && (
                  <div className="text-primary/60 mt-2 flex items-center text-xs">
                    <Search className="mr-1 size-3" />
                    <span>Cliquez pour plus de détails</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-h-[60vh] w-full overflow-y-auto bg-white/30 p-6 md:max-h-[65vh] md:w-1/2">
        <AnimatePresence mode="wait">
          {selectedEvent && (
            <motion.div
              key={selectedEvent.type + selectedEvent.date.getTime()}
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
                <Badge
                  className={getArtifactRarityColor(
                    selectedArtifact.rarity as ArtifactRarity
                  )}
                >
                  {selectedArtifact.rarity}
                </Badge>
              </div>

              <div className="border-primary/20 rounded-lg border bg-white/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="text-secondary mr-2 size-4" />
                    <span className="text-primary text-sm font-medium">
                      Date
                    </span>
                  </div>
                  <span className="text-primary/80">
                    {formatDateTime(selectedEvent.date.toString(), locale)}
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
                        {selectedEvent.user}
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
                        {selectedEvent.location}
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
                        {selectedEvent.fromUser}
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
                        {selectedEvent.toUser}
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
                        {selectedEvent.user}
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

              <div className="border-primary/20 rounded-lg border bg-white/70 p-4">
                <h4 className="text-primary mb-2 flex items-center font-medium">
                  <Sparkles className="text-secondary mr-2 size-4" />
                  Détails de l'événement
                </h4>
                <p className="text-primary/80 text-sm">
                  {selectedEvent.details}
                </p>
              </div>

              {selectedEvent.type === "discovery" && (
                <div className="flex justify-center">
                  <Button
                    className="bg-primary hover:bg-secondary text-accent"
                    onClick={() => handleVisualize()}
                  >
                    <View3d className="mr-2 size-4" /> Visualiser l'artefact
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ArtifactHistory

export const getEventIcon = (type: ArtifactHistoryEventMocked["type"]) => {
  switch (type) {
    case "discovery":
      return <Compass className="size-5 text-green-500" />

    case "transfer":
      return <ArrowRight className="size-5 text-blue-500" />

    case "listing":
      return <DollarSign className="text-accent size-5" />

    default:
      return <Clock className="size-5 text-gray-500" />
  }
}
