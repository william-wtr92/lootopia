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
import {
  Award,
  ChevronRightIcon,
  Clock,
  MapPin,
  PencilRulerIcon,
  UsersIcon,
} from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"

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

  const t = useTranslations("Components.Hunts.ListItem")

  const { toast } = useToast()
  const qc = useQueryClient()

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserLoggedIn(),
  })

  const [map, setMap] = useState<L.Map | null>(null)
  const [isDeployed, setIsDeployed] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  const hiddenRewards = hunt.chests.slice(1)

  const isOrganizer = hunt.organizerId === user?.id

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
      <div
        className="bg-primaryBg flex w-full cursor-pointer flex-col overflow-hidden rounded-[12px]"
        onClick={(e) => {
          handleIsDeployed()
          e.stopPropagation()
        }}
      >
        <div className="flex w-full items-center gap-4 p-4">
          <Image
            src={
              hunt.organizer?.avatar
                ? config.blobUrl + hunt.organizer?.avatar
                : "/avatar-placeholder.png"
            }
            alt="Avatar"
            width={60}
            height={60}
            className="aspect-square rounded-full"
          />

          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <h1 className="text-primary text-xl font-semibold">
                {hunt.name}
              </h1>
              <span className="text-secondary text-md">{hunt.description}</span>
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
                {formatDate(hunt.startDate) + " - " + formatDate(hunt.endDate)}
              </span>

              <span>
                <UsersIcon size={24} className="text-accent inline-block" />{" "}
                {hunt.maxParticipants ? hunt.maxParticipants : "∞"}
              </span>

              <div className="flex cursor-help items-center">
                <Award size={24} className="text-accent inline-block" />

                <span className="border-primary bg-primary text-accent mr-1 rounded-xl border px-2 py-1">
                  {hunt.chests[0].reward}
                </span>

                <AnimatePresence>
                  {isDeployed && (
                    <MotionComponent
                      className="flex gap-1"
                      {...anim(hiddenRewardsListVariant)}
                    >
                      {hiddenRewards.map((chest, index) => (
                        <MotionComponent
                          type="span"
                          key={index}
                          variants={rewardItemVariant}
                          className="text-primary border-accent bg-accent rounded-xl border px-2 py-1"
                        >
                          {chest.reward}
                        </MotionComponent>
                      ))}
                    </MotionComponent>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {isOrganizer && (
            <PencilRulerIcon
              size={26}
              className="text-accent hover:text-primary duration-300"
              onClick={(e) => {
                e.stopPropagation()
                handleShowUpdateForm()
              }}
            />
          )}

          <ChevronRightIcon
            className={`text-primary duration-300 ${isDeployed ? "rotate-90" : ""} `}
            size={32}
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

const rewardItemVariant = {
  initial: { opacity: 0, scale: 0 },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.3,
    },
  },
}
