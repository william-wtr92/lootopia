"use client"

import type { ChestSchema, HuntSchema, UserSchema } from "@common/index"
import { AnimatePresence } from "framer-motion"
import { Award, ChevronRightIcon, Clock, MapPin, UsersIcon } from "lucide-react"
import Image from "next/image"
import React, { useState } from "react"

import { config } from "@client/env"
import { formatDate } from "@client/utils/helpers/formatDate"
import Map from "@client/web/components/features/hunts/Map"
import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import anim from "@client/web/utils/anim"

type Props = {
  hunt: HuntSchema & {
    chests: ChestSchema[]
    organizer: UserSchema
  }
}

const mapHeight = 300

const HuntListItem = (props: Props) => {
  const { hunt } = props

  const [map, setMap] = useState<L.Map | null>(null)
  const [isDeployed, setIsDeployed] = useState<boolean>(false)

  const handleIsDeployed = () => {
    setIsDeployed((prev) => !prev)
  }

  const hiddenRewards = hunt.chests.slice(1)

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

  return (
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
            hunt.organizer.avatar
              ? config.blobUrl + hunt.organizer.avatar
              : "/avatar-placeholder.png"
          }
          alt="Avatar"
          width={60}
          height={60}
          className="aspect-square rounded-full"
        />

        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <h1 className="text-primary text-xl font-semibold">{hunt.name}</h1>
            <span className="text-secondary text-md">{hunt.description}</span>
          </div>

          <div className="text-primary flex items-center gap-6 text-sm font-medium">
            <span>
              <MapPin size={24} className="text-accent inline-block" />{" "}
              <span className="first-letter:uppercase">{hunt.city}</span>
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
              chests={hunt.chests}
              heightClass="h-[300px]"
              centerOnHuntRadius={true}
              displayChests={false}
            />
          </MotionComponent>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HuntListItem
