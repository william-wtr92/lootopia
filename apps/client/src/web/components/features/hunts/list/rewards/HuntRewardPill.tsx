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

import HuntArtifactContent from "./HuntArtifactContent"
import HuntCrownContent from "./HuntCrownContent"
import Loader from "@client/web/components/utils/Loader"
import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import { getArtifactById } from "@client/web/services/artifacts/getArtifactById"
import type { HuntResponse } from "@client/web/services/hunts/getHunts"

type Props =
  | { chest: HuntResponse["chests"][0]; artifactId?: never }
  | { chest?: never; artifactId: string }

const HuntRewardPill = (props: Props) => {
  const t = useTranslations("Components.Hunts.List.Rewards")

  const isStandalone = !!props.artifactId
  const artifactId = isStandalone
    ? props.artifactId
    : (props.chest?.artifactId ?? "")

  const rewardType = isStandalone
    ? CHEST_REWARD_TYPES.artifact
    : (props.chest?.rewardType ?? CHEST_REWARD_TYPES.artifact)

  const [open, setOpen] = useState(isStandalone)

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["artifact", artifactId],
    queryFn: () => {
      if (!artifactId) {
        return null
      }

      return getArtifactById(artifactId)
    },
    enabled: !!artifactId && open && rewardType === CHEST_REWARD_TYPES.artifact,
  })

  const handleOpen = (bool: boolean) => {
    setOpen(bool)

    if (bool) {
      refetch()
    }
  }

  const artifactName = data?.name
  const rewardDescription = isStandalone ? "" : (props.chest?.description ?? "")
  const crownsReward = !isStandalone ? props.chest?.reward : null

  const rewardName =
    rewardType === CHEST_REWARD_TYPES.artifact
      ? artifactName
      : crownsReward + t("crownsExtension")

  return (
    <MotionComponent variants={rewardItemVariant}>
      <Dialog key={rewardType} open={open} onOpenChange={handleOpen}>
        {!isStandalone && (
          <DialogTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <div className="border-primary bg-primary text-accent tbr rounded-xl border px-2 py-1">
              {t(rewardType)}
            </div>
          </DialogTrigger>
        )}

        <DialogContent
          hideClose={true}
          className="bg-secondaryBg text-secondary max-h-[90vh] overflow-hidden rounded-md border-none outline-none"
          size="fit"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex min-h-full flex-col justify-between">
            <DialogTitle className="from-primary to-secondary flex items-center justify-between bg-gradient-to-r p-4 text-white">
              <div className="flex items-center gap-2">
                {rewardType === CHEST_REWARD_TYPES.artifact ? (
                  <Shovel className="text-accent size-7" />
                ) : (
                  <Crown className="text-accent size-7" />
                )}
                <span className="text-2xl font-medium">{t(rewardType)}</span>
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

            <MotionComponent className="flex min-h-[100px] w-[350px] flex-col items-center gap-3 rounded-md p-8 md:min-h-[400px] md:w-[500px]">
              {data && rewardType === CHEST_REWARD_TYPES.artifact ? (
                <HuntArtifactContent
                  data={data}
                  description={rewardDescription}
                  onClose={() => handleOpen(false)}
                />
              ) : isFetching ? (
                <div className="flex size-full items-center justify-center">
                  <Loader label={t("artifactLoading")} />
                </div>
              ) : (
                <HuntCrownContent
                  rewardName={rewardName ?? ""}
                  description={rewardDescription}
                  onClose={() => handleOpen(false)}
                />
              )}
            </MotionComponent>

            <div className="from-primary via-secondary to-accent h-2 w-full bg-gradient-to-r"></div>
          </div>
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
