"use client"

import { ChevronRightIcon, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import React, { useState } from "react"

type Props = {
  hunt: {
    city: string
    name: string
    description: string
    startDate: string
    endDate: string
    mode: boolean
    maxParticipants: number | null
    id: string
    active: boolean
    createdAt: string
    updatedAt: string
    organizerId: string
  }
}

const HuntListItem = (props: Props) => {
  const { hunt } = props

  const [isDeployed, setIsDeployed] = useState<boolean>(false)

  const handleIsDeployed = () => {
    setIsDeployed((prev) => !prev)
  }

  // const mapVariant = {
  //   initial: { opacity: 0, height: 0 },
  //   enter: {
  //     opacity: 1,
  //     height: "auto",
  //     transition: {
  //       duration: 0.3,
  //     },
  //   },
  //   exit: { opacity: 0, height: 0 },
  // }

  return (
    <div className="bg-primaryBg flex w-full flex-col overflow-hidden rounded-[12px]">
      {/* Line not deployed */}
      <div className="flex w-full items-center gap-4 p-4">
        {/* Image */}
        <Image
          src={"/avatar-placeholder.png"}
          alt="Avatar"
          width={60}
          height={60}
          className="aspect-square rounded-full"
        />

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <h1 className="text-primary text-xl font-semibold">{hunt.name}</h1>
            <span className="text-secondary text-md">{hunt.description}</span>
          </div>

          <div className="text-primary flex gap-6 text-sm font-medium">
            <span>
              <MapPin className="text-accent inline-block" />
              {hunt.city}
            </span>
            <span>
              <Clock className="text-accent inline-block" /> {hunt.startDate}
            </span>
            {/* <span>
              <Award className="text-accent inline-block" /> {hunt.reward}
            </span> */}
          </div>
        </div>

        {/* Deploy button */}
        <ChevronRightIcon
          className={`text-primary duration-300 ${isDeployed ? "rotate-90" : ""} `}
          size={32}
          onClick={handleIsDeployed}
        />
      </div>

      {/* Map */}
      {/* <AnimatePresence>
        {isDeployed && (
          <MotionComponent type="div" {...anim(mapVariant)}>
            <iframe
              src={hunt.mapUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </MotionComponent>
        )}
      </AnimatePresence> */}
    </div>
  )
}

export default HuntListItem
