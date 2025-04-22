import type { ArtifactRarity } from "@lootopia/common"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lootopia/ui"
import { motion } from "framer-motion"
import { Award, Gem, SearchX, View } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import HuntRewardPill from "@client/web/components/features/hunts/list/rewards/HuntRewardPill"
import type { UserStatisticsResponse } from "@client/web/services/users/getUserByNickname"
import { getArtifactRarityColor } from "@client/web/utils/def/colors"
import { formatDate } from "@client/web/utils/helpers/formatDate"

type Props = {
  nickname: string
  recentArtifacts: UserStatisticsResponse["artifacts"]
}

const ProfileArtifacts = ({ nickname, recentArtifacts }: Props) => {
  const t = useTranslations("Components.Users.Profile.Stats.ProfileArtifacts")
  const locale = useLocale()

  const [showArtifact, setShowArtifact] = useState(false)
  const [artifactId, setArtifactId] = useState<string | null>(null)

  const handleArtifactClick = (id: string) => {
    setShowArtifact(true)
    setArtifactId(id)
  }

  return (
    <Card className="border-primary">
      <CardHeader className="text-primary">
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t.rich("subtitle", {
            nickname,
            strong: (children) => (
              <span className="font-semibold">{children}</span>
            ),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentArtifacts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentArtifacts.map((artifact, i) => (
              <motion.div
                key={i}
                className="border-primary rounded-lg border p-4 hover:shadow-md"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex w-full items-center justify-between gap-14">
                  <div className="flex items-center gap-8">
                    <div className="relative">
                      <Gem className="text-primary size-8" />
                    </div>
                    <div>
                      <h3 className="text-primary mb-1 flex items-center gap-2 font-bold">
                        <span>{artifact.name}</span>
                        <Badge
                          className={`text-xs ${getArtifactRarityColor(artifact.rarity as ArtifactRarity)}`}
                        >
                          {t(`rarities.${artifact.rarity as ArtifactRarity}`)}
                        </Badge>
                      </h3>
                      <div className="text-primary mb-1 flex items-center gap-1 text-xs">
                        <Award className="size-3" />
                        <span>
                          {t("obtainedAt", {
                            date: formatDate(artifact.obtainedAt!, locale),
                          })}
                        </span>
                      </div>
                      <p className="text-primary text-sm">
                        {t("hunt", {
                          huntName: artifact.huntName,
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="mr-6"
                    onClick={() =>
                      artifact.id && handleArtifactClick(artifact.id)
                    }
                  >
                    {t("cta.view")}
                    <View className="size-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-primary flex h-24 items-center justify-center gap-4">
            <SearchX className="size-6" />
            <span className="font-semibold">{t("empty")}</span>
          </div>
        )}

        {showArtifact && artifactId && (
          <HuntRewardPill key={artifactId} artifactId={artifactId} />
        )}
      </CardContent>
    </Card>
  )
}

export default ProfileArtifacts
