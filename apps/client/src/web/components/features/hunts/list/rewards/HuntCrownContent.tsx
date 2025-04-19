import { artifactRarity } from "@lootopia/common"
import { Button } from "@lootopia/ui"
import { Crown } from "lucide-react"
import { useTranslations } from "next-intl"

import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import anim from "@client/web/utils/anim"
import { getRewardPillRarityColor } from "@client/web/utils/def/colors"

type Props = {
  rewardName: string
  description: string
  onClose: () => void
}

const HuntCrownContent = ({ rewardName, description, onClose }: Props) => {
  const t = useTranslations("Components.Hunts.List.Rewards")

  return (
    <>
      <MotionComponent {...anim(rewardItemVariant)}>
        <Crown size={160} className="text-primary" />
      </MotionComponent>

      <MotionComponent
        type="span"
        className="text-primary text-2xl font-medium"
        {...anim(rewardNameVariant)}
      >
        {rewardName}
      </MotionComponent>

      <MotionComponent
        type="span"
        className={`${getRewardPillRarityColor(artifactRarity.common)} rounded-full px-4 py-1`}
        {...anim(rarityPillVariant)}
      >
        {t("rarities.common")}
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

export default HuntCrownContent

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
