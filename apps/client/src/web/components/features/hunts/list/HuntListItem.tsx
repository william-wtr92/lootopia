"use client"

import type { ChestSchema, HuntSchema } from "@lootopia/common"
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  useToast,
  Sheet,
} from "@lootopia/ui"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AnimatePresence } from "framer-motion"
import { Award, ChevronRight, Clock, MapPin, Users } from "lucide-react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import HuntListItemActions from "./HuntListItemActions"
import HuntListItemBadges from "./HuntListItemBadges"
import HuntRewardPill from "./rewards/HuntRewardPill"
import { config } from "@client/env"
import HuntForm from "@client/web/components/features/hunts/form/HuntForm"
import Map from "@client/web/components/features/hunts/Map"
import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import type { HuntResponse } from "@client/web/services/hunts/getHunts"
import { updateHunt } from "@client/web/services/hunts/updateHunt"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import anim from "@client/web/utils/anim"
import type { HuntFilterType } from "@client/web/utils/def/huntFilter"
import { capitalizeFirstLetter } from "@client/web/utils/helpers/capitalizeFirstLetter"
import { formatDate } from "@client/web/utils/helpers/formatDate"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  hunt: HuntResponse
  huntFilterType: HuntFilterType
}

const mapHeight = 300

const HuntListItem = (props: Props) => {
  const { hunt, huntFilterType } = props

  const t = useTranslations("Components.Hunts.List.ListItem")
  const locale = useLocale()
  const { toast } = useToast()
  const qc = useQueryClient()

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserLoggedIn(),
  })

  const isOrganizer = hunt.organizerId === user?.id

  const [map, setMap] = useState<L.Map | null>(null)
  const [isDeployed, setIsDeployed] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  const hiddenRewards = hunt.chests.slice(1)

  const handleIsDeployed = () => {
    setIsDeployed((prev) => !prev)
  }

  const handleShowUpdateForm = () => {
    setShowUpdateForm((prev) => !prev)
  }

  const handleUpdateHunt = async (data: HuntSchema) => {
    const [status, key] = await updateHunt({ huntId: hunt.id }, data)

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${key}`),
      })

      return
    }

    toast({
      variant: "default",
      description: t("success"),
    })

    handleShowUpdateForm()

    qc.invalidateQueries({ queryKey: ["hunts"] })
    qc.invalidateQueries({ queryKey: ["hunt", hunt.id] })
    qc.invalidateQueries({ queryKey: ["hunts", huntFilterType] })
  }

  return (
    <>
      <div className="bg-primaryBg flex w-full flex-col overflow-hidden rounded-[12px]">
        <div className="flex w-full items-center gap-4 p-4">
          <Image
            src={
              hunt?.organizer?.avatar
                ? config.blobUrl + hunt?.organizer.avatar
                : "/avatar-placeholder.png"
            }
            alt="Avatar"
            width={60}
            height={60}
            className="aspect-square rounded-full"
          />

          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-primary text-xl font-semibold">
                  {hunt.name}
                </h1>

                <HuntListItemBadges hunt={hunt} isOrganizer={isOrganizer} />
              </div>
              <span
                className={`text-secondary text-md line-clamp-1 ${isDeployed ? "line-clamp-none" : ""}`}
              >
                {hunt.description}
              </span>
            </div>

            <div className="text-primary flex items-center gap-6 text-sm font-medium">
              <span>
                <MapPin size={24} className="text-accent inline-block" />{" "}
                <span className="first-letter:uppercase">
                  {capitalizeFirstLetter(hunt.city)}
                </span>
              </span>

              <span>
                <Clock size={24} className="text-accent inline-block" />{" "}
                {formatDate(hunt.startDate, locale) +
                  " - " +
                  formatDate(hunt.endDate, locale)}
              </span>

              <span className="flex items-center gap-1">
                <Users size={24} className="text-accent inline-block" />{" "}
                {hunt.participantCount} /{" "}
                {hunt.maxParticipants ? hunt.maxParticipants : "∞"}
              </span>

              <div className="flex cursor-help items-center">
                <Award size={24} className="text-accent inline-block" />

                <HuntRewardPill chest={hunt.chests[0]} />

                <AnimatePresence>
                  {isDeployed && (
                    <MotionComponent
                      className="ml-1 flex gap-1"
                      {...anim(hiddenRewardsListVariant)}
                    >
                      {hiddenRewards.map((chest, index) => (
                        <HuntRewardPill key={index} chest={chest} />
                      ))}
                    </MotionComponent>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <HuntListItemActions
            hunt={hunt}
            isOrganizer={isOrganizer}
            onShowUpdateForm={handleShowUpdateForm}
          />

          <ChevronRight
            size={32}
            className={`text-primary cursor-pointer duration-300 ${isDeployed ? "rotate-90" : ""} `}
            onClick={() => {
              handleIsDeployed()
            }}
          />
        </div>

        <AnimatePresence>
          {isDeployed && (
            <MotionComponent type="div" {...anim(mapVariant)}>
              <Map
                map={map}
                setMap={setMap}
                chests={hunt.chests as ChestSchema[]}
                heightClass="h-[300px]"
                centerOnHuntRadius={true}
                displayChests={false}
              />
            </MotionComponent>
          )}
        </AnimatePresence>
      </div>

      <Sheet open={showUpdateForm} onOpenChange={handleShowUpdateForm}>
        <SheetContent className="bg-primaryBg text-primary">
          <SheetHeader>
            <SheetTitle>{t("title")}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <HuntForm
              mode="update"
              updateHunt={hunt}
              onSubmit={handleUpdateHunt}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default HuntListItem

const mapVariant = {
  initial: { opacity: 0, height: 0 },
  enter: {
    opacity: 1,
    height: mapHeight,
    transition: {
      duration: 0.3,
    },
  },
  exit: { opacity: 0, height: 0 },
}

const hiddenRewardsListVariant = {
  initial: {},
  enter: {
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
  exit: {
    transition: {
      when: "afterChildren",
      staggerChildren: 0.3,
      staggerDirection: -1,
    },
  },
}
