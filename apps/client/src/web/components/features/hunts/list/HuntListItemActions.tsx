import { participationRequestStatus } from "@lootopia/common"
import {
  Button,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import { PencilRuler, UserCog, Clock, CircleX, UserPlus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import DeleteParticipationDialog from "./participations/actions/DeleteParticipationDialog"
import ParticipateDialog from "./participations/actions/ParticipateDialog"
import ParticipationRequestDialog from "./participations/actions/ParticipationRequestDialog"
import ParticipationRequestListDialog from "./participations/ParticipationRequestListDialog"
import type { HuntResponse } from "@client/web/services/hunts/getHunts"
import { getParticipationRequestCount } from "@client/web/services/participations/getParticipationRequestCount"

type Props = {
  hunt: HuntResponse
  isOrganizer: boolean
  onShowUpdateForm: () => void
}

const HuntListItemActions = ({
  hunt,
  isOrganizer,
  onShowUpdateForm,
}: Props) => {
  const t = useTranslations("Components.Hunts.List.ListItemActions")

  const { data: participationRequestCount = 0 } = useQuery({
    queryKey: ["participationRequestCount", hunt.id],
    queryFn: () => getParticipationRequestCount({ huntId: hunt.id }),
    enabled: isOrganizer && !hunt.public,
  })

  const [showParticipatePopup, setShowParticipatePopup] = useState(false)
  const [showLeavePopup, setShowLeavePopup] = useState(false)
  const [showRequestPopup, setShowRequestPopup] = useState(false)
  const [showRequestList, setShowRequestList] = useState(false)

  const isJoined =
    hunt.participationStatus === participationRequestStatus.APPROVED
  const isPending =
    hunt.participationStatus === participationRequestStatus.PENDING

  const handleShowParticipatePopup = () => {
    setShowParticipatePopup((prev) => !prev)
  }

  const handleShowLeavePopup = () => {
    setShowLeavePopup((prev) => !prev)
  }

  const handleShowRequestPopup = () => {
    setShowRequestPopup((prev) => !prev)
  }

  const handleShowRequestList = () => {
    setShowRequestList((prev) => !prev)
  }

  const MAX_COUNT = 99 as const
  const formattedCount =
    participationRequestCount > MAX_COUNT
      ? t("tooltip.max")
      : participationRequestCount

  return (
    <>
      <div className="flex w-36 items-center justify-center gap-2">
        {isOrganizer ? (
          <>
            {!hunt.public && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="hover:text-primary relative hover:bg-white/80"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShowRequestList()
                      }}
                    >
                      <UserCog size={22} />
                      {participationRequestCount > 0 && (
                        <span className="bg-error absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full text-xs text-white">
                          {formattedCount}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="relative bottom-1">
                    <p>{t("tooltip.info")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Button
              size="icon"
              variant="outline"
              className="hover:text-primary hover:bg-white/80"
              onClick={(e) => {
                e.stopPropagation()
                onShowUpdateForm()
              }}
            >
              <PencilRuler size={20} />
            </Button>
          </>
        ) : isJoined ? (
          <Button
            size="lg"
            variant="destructive"
            className="hover:bg-error/40 w-[140px]"
            onClick={handleShowLeavePopup}
          >
            <CircleX size={16} className="mr-1" />
            {t("cta.leave")}
          </Button>
        ) : isPending ? (
          <Button
            size="lg"
            variant="outline"
            className="w-[140px] cursor-not-allowed border-blue-500 text-blue-500"
            disabled
          >
            <Clock size={16} className="mr-1" />
            {t("cta.pending")}
          </Button>
        ) : hunt.public ? (
          <Button
            size="lg"
            className="w-[140px]"
            onClick={handleShowParticipatePopup}
          >
            <UserPlus size={16} className="mr-1" />
            {t("cta.join")}
          </Button>
        ) : (
          <Button
            size="lg"
            variant="outline"
            className="w-[140px] border-blue-500 text-blue-500 hover:bg-blue-500/10 hover:text-blue-500"
            onClick={handleShowRequestPopup}
          >
            <UserPlus size={12} className="mr-1" />
            {t("cta.request")}
          </Button>
        )}
      </div>

      <ParticipateDialog
        open={showParticipatePopup}
        setIsOpen={handleShowParticipatePopup}
        huntId={hunt.id}
      />

      <DeleteParticipationDialog
        open={showLeavePopup}
        setIsOpen={handleShowLeavePopup}
        huntId={hunt.id}
      />

      <ParticipationRequestDialog
        open={showRequestPopup}
        setIsOpen={handleShowRequestPopup}
        huntId={hunt.id}
      />

      <ParticipationRequestListDialog
        open={showRequestList}
        setIsOpen={handleShowRequestList}
        hunt={hunt}
      />
    </>
  )
}

export default HuntListItemActions
