import { Button } from "@lootopia/ui"
import { useTranslations } from "next-intl"

import { config } from "@client/env"
import { ThreeDViewer } from "@client/web/components/features/artifacts/three/ThreeDViewer"
import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import type { ArtifactResponse } from "@client/web/services/artifacts/getArtifactById"
import anim from "@client/web/utils/anim"
import { getRewardPillRarityColor } from "@client/web/utils/def/colors"

type Props = {
  data: ArtifactResponse | null
  description: string
  onClose: () => void
}

const HuntArtifactContent = ({ data, description, onClose }: Props) => {
  const t = useTranslations("Components.Hunts.List.Rewards.ArtifactContent")

  const fileUrl = data?.link ? `${config.blobUrl}${data.link}` : ""

  return (
    <>
      <div className="mb-4 h-[300px] w-full cursor-grab rounded-md">
        {fileUrl ? (
          <ThreeDViewer fileUrl={fileUrl} />
        ) : (
          <p>{t("fileNotFoundOrNotSupported")}</p>
        )}
      </div>

      <MotionComponent
        type="span"
        className="text-primary text-2xl font-medium"
        {...anim(rewardNameVariant)}
      >
        {data?.name}
      </MotionComponent>

      <MotionComponent
        type="span"
        className={`${getRewardPillRarityColor(data?.rarity ?? "common")} rounded-full px-4 py-1`}
        {...anim(rarityPillVariant)}
      >
        {t(`rarities.${data?.rarity ?? "common"}`)}
      </MotionComponent>

      <MotionComponent
        type="span"
        className="text-primary mb-2 text-center text-lg font-normal"
        {...anim(descriptionVariant)}
      >
        {description}
      </MotionComponent>

      <MotionComponent {...anim(closeBtnVariant)}>
        <Button variant="secondary" size="lg" onClick={onClose}>
          {t("cta.close")}
        </Button>
      </MotionComponent>
    </>
  )
}

export default HuntArtifactContent

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
