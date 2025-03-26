/* eslint-disable complexity */
import type { ChestSchema } from "@common/index"
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import { CrownIcon, ShovelIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import React, { useState } from "react"

import { ThreeDViewer } from "../../../artifacts/three/ThreeDViewer"
import { config } from "@client/env"
import Loader from "@client/web/components/utils/Loader"
import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import { getArtifactById } from "@client/web/services/artifacts/getArtifactById"
import anim from "@client/web/utils/anim"

type Props = {
  chest: ChestSchema & { artifactId?: string }
}

const HuntRewardPill = (props: Props) => {
  const { chest } = props
  const t = useTranslations("Components.Hunts.List.Rewards")

  const [open, setOpen] = useState(false)
  const [isModelLoaded, setModelLoaded] = useState(false)

  const { data, refetch } = useQuery({
    queryKey: ["artifact", chest.artifactId],
    queryFn: () => getArtifactById(chest.artifactId as string),
    enabled: !!chest.artifactId && open && chest.rewardType === "artifact",
  })

  const handleOpen = (bool: boolean) => {
    setOpen(bool)
    refetch()
  }

  const handleModelLoaded = () => {
    setModelLoaded(true)
  }

  const artifactName = data?.name
  const fileUrl = config.blobUrl + data?.link
  const fileType = data?.link && data?.link.split(".").pop()

  const rewardName =
    chest.rewardType === "artifact" ? artifactName : chest.reward + " couronnes"
  const rewardDescription = chest.description

  const rewardItemVariant = {
    initial: { opacity: 0, scale: 0 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: {},
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {},
    },
  }

  const rewardNameVariant = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    enter: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
      },
    },
  }

  const rarityPillVariant = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    enter: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  }

  const descriptionVariant = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    enter: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5,
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  }

  const closeBtnVariant = {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.7,
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  }

  const testVariant = {
    initial: {},
    enter: {
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  }

  return (
    <MotionComponent variants={rewardItemVariant}>
      <Dialog key={chest.rewardType} open={open} onOpenChange={handleOpen}>
        <DialogTrigger
          asChild
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className="border-primary bg-primary text-accent tbr mr-1 rounded-xl border px-2 py-1">
            {t(chest.rewardType)}
          </div>
        </DialogTrigger>

        <DialogContent
          hideClose={true}
          className="bg-secondaryBg text-secondary overflow-hidden border-none outline-none"
          size="fit"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="text-accent bg-primary flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              {chest.rewardType === "artifact" ? (
                <ShovelIcon size={24} />
              ) : (
                <CrownIcon size={24} />
              )}
              <span className="text-2xl font-medium">
                {t(chest.rewardType)}
              </span>
            </div>
            <XIcon
              size={24}
              className="cursor-pointer"
              onClick={() => handleOpen(false)}
            />
          </DialogTitle>

          <MotionComponent
            className="flex min-h-[400px] w-[500px] flex-col items-center gap-3 rounded-md p-8"
            {...anim(testVariant)}
          >
            {data ? (
              <>
                {chest.rewardType === "artifact" ? (
                  <div className="mb-4 h-[300px] w-full cursor-grab rounded-md">
                    {fileUrl ? (
                      <ThreeDViewer
                        fileUrl={fileUrl}
                        fileType={fileType}
                        isModelLoaded={isModelLoaded}
                        handleModelLoaded={handleModelLoaded}
                      />
                    ) : (
                      <p>{t("fileNotFoundOrNotSupported")}</p>
                    )}
                  </div>
                ) : (
                  <MotionComponent {...anim(rewardItemVariant)}>
                    <CrownIcon size={160} className="text-primary" />
                  </MotionComponent>
                )}

                <MotionComponent
                  type="span"
                  className="text-primary text-2xl font-medium"
                  {...anim(rewardNameVariant)}
                >
                  {rewardName}
                </MotionComponent>

                <MotionComponent
                  type="span"
                  className="text-primary rounded-full bg-[#FFAA00] px-4 py-1"
                  {...anim(rarityPillVariant)}
                >
                  {t("rarities.legendary")}
                </MotionComponent>

                <MotionComponent
                  type="span"
                  className="text-primary mb-2 text-center text-lg font-normal"
                  {...anim(descriptionVariant)}
                >
                  {rewardDescription}
                </MotionComponent>

                <MotionComponent {...anim(closeBtnVariant)}>
                  <Button
                    variant={"secondary"}
                    size={"lg"}
                    onClick={() => handleOpen(false)}
                  >
                    {t("cta.close")}
                  </Button>
                </MotionComponent>
              </>
            ) : (
              <div className="flex size-full items-center justify-center">
                <Loader label="Chargement de l'artéfact..." />
              </div>
            )}
          </MotionComponent>

          <div className="h-2 w-full bg-gradient-to-r from-[#4A0E4E] via-[#8A4FFF] to-[#FFD700]"></div>
        </DialogContent>
      </Dialog>
    </MotionComponent>
  )
}

export default HuntRewardPill
