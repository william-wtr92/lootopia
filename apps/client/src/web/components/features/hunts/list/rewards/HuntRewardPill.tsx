import { CHEST_REWARD_TYPES } from "@lootopia/common"
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import { Crown, Shovel, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { config } from "@client/env"
import { ThreeDViewer } from "@client/web/components/features/artifacts/three/ThreeDViewer"
import Loader from "@client/web/components/utils/Loader"
import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import { getArtifactById } from "@client/web/services/artifacts/getArtifactById"
import type { HuntResponse } from "@client/web/services/hunts/getHunts"
import anim from "@client/web/utils/anim"
import { getRewardPillRarityColor } from "@client/web/utils/def/colors"

type Props = {
  chest: HuntResponse["chests"][0]
}

const HuntRewardPill = (props: Props) => {
  const { chest } = props
  const t = useTranslations("Components.Hunts.List.Rewards")

  const [open, setOpen] = useState(false)

  const { data, refetch } = useQuery({
    queryKey: ["artifact", chest.artifactId],
    queryFn: () => getArtifactById(chest.artifactId as string),
    enabled:
      !!chest.artifactId &&
      open &&
      chest.rewardType === CHEST_REWARD_TYPES.artifact,
  })

  const handleOpen = (bool: boolean) => {
    setOpen(bool)
    refetch()
  }

  const artifactName = data?.name
  const fileUrl = config.blobUrl + data?.link

  const rewardName =
    chest.rewardType === CHEST_REWARD_TYPES.artifact
      ? artifactName
      : chest.reward + t("crownsExtension")
  const rewardDescription = chest.description

  return (
    <MotionComponent variants={rewardItemVariant}>
      <Dialog key={chest.rewardType} open={open} onOpenChange={handleOpen}>
        <DialogTrigger
          asChild
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className="border-primary bg-primary text-accent tbr rounded-xl border px-2 py-1">
            {t(chest.rewardType)}
          </div>
        </DialogTrigger>

        <DialogContent
          hideClose={true}
          className="bg-secondaryBg text-secondary overflow-hidden border-none outline-none"
          size="fit"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="from-primary to-secondary flex items-center justify-between bg-gradient-to-r p-4 text-white">
            <div className="flex items-center gap-2">
              {chest.rewardType === CHEST_REWARD_TYPES.artifact ? (
                <Shovel className="text-accent size-7" />
              ) : (
                <Crown className="text-accent size-7" />
              )}
              <span className="text-2xl font-medium">
                {t(chest.rewardType)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10 focus-visible:ring-0"
              onClick={() => handleOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </DialogTitle>

          <MotionComponent className="flex min-h-[400px] w-[500px] flex-col items-center gap-3 rounded-md p-8">
            {data ? (
              <>
                {chest.rewardType === CHEST_REWARD_TYPES.artifact ? (
                  <div className="mb-4 h-[300px] w-full cursor-grab rounded-md">
                    {fileUrl ? (
                      <ThreeDViewer fileUrl={fileUrl} />
                    ) : (
                      <p>{t("fileNotFoundOrNotSupported")}</p>
                    )}
                  </div>
                ) : (
                  <MotionComponent {...anim(rewardItemVariant)}>
                    <Crown size={160} className="text-primary" />
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
                  className={`${getRewardPillRarityColor(data?.rarity)} rounded-full px-4 py-1`}
                  {...anim(rarityPillVariant)}
                >
                  {t(`rarities.${data?.rarity ?? "common"}`)}
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
                <Loader label={t("artifactLoading")} />
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
