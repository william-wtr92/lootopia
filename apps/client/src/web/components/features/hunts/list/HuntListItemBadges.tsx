import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Badge,
} from "@lootopia/ui"
import {
  CalendarCheck2,
  CalendarClock,
  Lock,
  PencilRuler,
  Unlock,
} from "lucide-react"
import { useTranslations } from "next-intl"

import type { HuntResponse } from "@client/web/services/hunts/getHunts"

type Props = {
  hunt: HuntResponse
  isOrganizer: boolean
}

const HuntListItemBadges = ({ hunt, isOrganizer }: Props) => {
  const t = useTranslations("Components.Hunts.List.ListItemBadges")

  const isStarted = new Date(hunt.startDate) < new Date()

  return (
    <div className="flex items-center gap-2">
      {!hunt.public ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="border-primary text-primary">
                <Lock size={12} className="mr-1" />
                {t("tooltip.private.title")}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltip.private.description")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="border-success text-success">
                <Unlock size={12} className="mr-1" />
                {t("tooltip.public.title")}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltip.public.description")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {isStarted ? (
        <Badge className="border-primary text-accent">
          <CalendarCheck2 size={12} className="mr-1" />
          <span>{t("badges.ongoing")}</span>
        </Badge>
      ) : (
        <Badge className="bg-blue-600 text-white">
          <CalendarClock size={12} className="mr-1" />
          <span>{t("badges.toCome")}</span>
        </Badge>
      )}

      {isOrganizer && (
        <Badge className="bg-yellow-500 text-white">
          <PencilRuler size={12} className="mr-1" />
          <span>{t("badges.organizer")}</span>
        </Badge>
      )}
    </div>
  )
}

export default HuntListItemBadges
