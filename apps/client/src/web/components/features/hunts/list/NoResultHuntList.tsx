"use client"

import { Button } from "@lootopia/ui"
import { CirclePlus, DeleteIcon, Map, RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import React from "react"

import { routes } from "@client/utils/routes"
import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import anim from "@client/web/utils/anim"

type Props = {
  inputValue: string
  handleInputValue: (value: string) => void
  refetch: () => void
}

const NoResultHuntList = (props: Props) => {
  const { inputValue, handleInputValue, refetch } = props

  const t = useTranslations("Pages.Hunts.List")
  const router = useRouter()

  const refreshHunts = () => {
    refetch()
  }

  const deleteSearch = () => {
    handleInputValue("")

    setTimeout(() => {
      refetch()
    }, 1)
  }

  const redirectToHuntDraftPage = () => {
    router.push(routes.hunts.drafts)
  }

  const mapIconVariant = {
    enter: {
      rotate: [0, 10, -10, 0],
      y: [0, -5, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 0.5,
      },
    },
  }

  const circlePlusIconVariant = {
    enter: {
      scale: [1, 1.2, 1],
      rotate: [0, 15, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 0.5,
        delay: 0.5,
      },
    },
  }

  return (
    <div className="bg-secondaryBg border-primary flex h-full w-full flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed">
      <div className="relative">
        <MotionComponent {...anim(mapIconVariant)}>
          <Map className="h-20 w-20 text-[#4A0E4E]" />
        </MotionComponent>
        <MotionComponent
          {...anim(circlePlusIconVariant)}
          className="absolute -bottom-2 -right-2"
        >
          <CirclePlus className="h-8 w-8 rounded-full bg-[#4A0E4E] p-1 text-[#FFD700]" />
        </MotionComponent>
      </div>

      <span className="text-primary text-xl font-semibold">
        {inputValue.length === 0
          ? t("no-hunts-available")
          : t("no-hunts-search")}
        <span className="text-secondary">{inputValue}</span>.
      </span>

      <span className="text-secondary text-center">
        {inputValue.length === 0
          ? t("no-hunts-hint")
          : t("no-hunts-search-hint")}
      </span>

      <div className="space-x-2">
        {inputValue.length === 0 ? (
          <Button variant={"default"} onClick={refreshHunts}>
            <RefreshCcw /> {t("cta.refresh")}
          </Button>
        ) : (
          <Button variant={"default"} onClick={deleteSearch}>
            <DeleteIcon /> {t("cta.delete-search-value")}
          </Button>
        )}

        <Button variant={"secondary"} onClick={redirectToHuntDraftPage}>
          <CirclePlus />
          {t("cta.create-a-hunt")}
        </Button>
      </div>
    </div>
  )
}

export default NoResultHuntList
