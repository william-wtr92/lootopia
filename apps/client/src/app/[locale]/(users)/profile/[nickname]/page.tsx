"use client"

import type { ArtifactRarity } from "@lootopia/common"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Button,
} from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  MapPin,
  Calendar,
  Award,
  MapPinned,
  Swords,
  Gem,
  View,
} from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import { config } from "@client/env"
import HuntRewardPill from "@client/web/components/features/hunts/list/rewards/HuntRewardPill"
import ReportForm from "@client/web/components/features/reports/ReportForm"
import { getUserByNickname } from "@client/web/services/users/getUserByNickname"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import { getArtifactRarityColor } from "@client/web/utils/def/colors"
import { formatDate } from "@client/web/utils/helpers/formatDate"

const UserProfilePage = () => {
  const t = useTranslations("Pages.Users.UserProfile")
  const locale = useLocale()

  const { nickname } = useParams<{ nickname: string }>()

  const [activeTab, setActiveTab] = useState("hunts")
  const [showArtifact, setShowArtifact] = useState(false)
  const [artifactId, setArtifactId] = useState<string | null>(null)

  const { data: userLoggedIn } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserLoggedIn(),
  })

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile", nickname],
    queryFn: () => getUserByNickname({ nickname }),
    enabled: !!nickname,
  })

  const recentHunts = userProfile?.hunts || []
  const sortedArtifacts = userProfile?.artifacts || []

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleArtifactClick = (id: string) => {
    setShowArtifact(true)
    setArtifactId(id)
  }

  if (!userProfile || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-primary">{t("loading")}</p>
      </div>
    )
  }

  return (
    <main className="container relative z-10 mx-auto flex-1 px-4 py-8">
      <Card className="border-primary mb-8 overflow-hidden">
        <div className="relative">
          <div className="from-primary to-secondary flex h-32 items-center justify-between bg-gradient-to-r px-4 md:px-6">
            <div className="relative top-2 flex gap-4">
              <Image
                src={
                  userProfile.user.avatar
                    ? config.blobUrl + userProfile.user.avatar
                    : "/avatar-placeholder.png"
                }
                alt="Avatar"
                width={60}
                height={60}
                className="relative top-1 size-16 rounded-full bg-white object-contain p-1"
              />

              <h1 className="flex flex-col items-start justify-start gap-2 text-3xl font-bold">
                {userProfile.user.nickname}
                <Badge className="bg-accent text-primary">
                  {t("level", {
                    level: userProfile?.progression?.level,
                  })}
                </Badge>
              </h1>
            </div>

            {userLoggedIn?.id !== userProfile.user.id && (
              <ReportForm userNickname={userProfile.user.nickname} />
            )}
          </div>
        </div>
        <CardContent className="relative flex flex-col gap-6 pt-16 md:flex-row md:pt-4">
          <div className="flex-grow">
            <div className="mb-6 ml-16 flex flex-col gap-2">
              <p className="text-secondary text-xl font-semibold italic">
                {t("role")}
              </p>
              <div className="text-primary flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4" />
                <span>
                  {t("joined", {
                    date: formatDate(userProfile.user.createdAt, locale),
                  })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: t("stats.level"),
                  value: userProfile?.progression?.level,
                },
                {
                  label: t("stats.hunts"),
                  value: userProfile.stats.huntsCount,
                },
                {
                  label: t("stats.artifacts"),
                  value: userProfile.stats.artifactsCount,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="border-primary/20 from-secondary to-primary/80 rounded-lg border bg-gradient-to-r p-2 text-center"
                >
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-sm text-white">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="border-primary text-primary mb-4 border bg-white">
          <TabsTrigger
            value="hunts"
            className="data-[state=active]:bg-primary data-[state=active]:text-accent"
          >
            {t("tabs.recentHunts.trigger")}
          </TabsTrigger>
          <TabsTrigger
            value="artifacts"
            className="data-[state=active]:bg-primary data-[state=active]:text-accent"
          >
            {t("tabs.artifacts.trigger")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hunts">
          <Card className="border-primary">
            <CardHeader className="text-primary">
              <CardTitle>{t("tabs.recentHunts.title")}</CardTitle>
              <CardDescription>
                {t("tabs.recentHunts.subtitle", {
                  nickname: userProfile.user.nickname,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recentHunts.map((hunt) => (
                <motion.div
                  key={hunt?.id}
                  className="border-primary flex justify-between gap-4 rounded-lg border bg-white/40 p-4 transition hover:bg-white/60"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex w-full">
                    <div className="bg-accent/20 flex items-center justify-center rounded-full p-6">
                      <Swords className="text-primary size-9" />
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-primary mb-1 truncate text-lg font-semibold">
                        {hunt?.name}
                      </h3>

                      <div className="text-primary mb-3 flex items-center gap-1 text-sm">
                        <span className="line-clamp-2">
                          {hunt?.description}
                        </span>
                      </div>

                      <div className="text-secondary flex items-center gap-1 text-sm">
                        <MapPin className="size-4" />
                        <span className="truncate">{hunt?.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-secondary flex w-1/6 flex-col justify-center gap-7 text-sm">
                    {hunt?.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {formatDate(hunt.startDate, locale)}
                      </div>
                    )}

                    {hunt?.endDate && (
                      <div className="flex items-center gap-1">
                        <MapPinned className="size-4" />
                        {formatDate(hunt.endDate, locale)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="artifacts">
          <Card className="border-primary">
            <CardHeader className="text-primary">
              <CardTitle>{t("tabs.artifacts.title")}</CardTitle>
              <CardDescription>
                {t("tabs.artifacts.subtitle", {
                  nickname: userProfile.user.nickname,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedArtifacts.map((artifact) => (
                <motion.div
                  key={artifact.id}
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
                            {t(
                              `tabs.artifacts.rarities.${artifact.rarity as ArtifactRarity}`
                            )}
                          </Badge>
                        </h3>
                        <div className="text-primary mb-1 flex items-center gap-1 text-xs">
                          <Award className="size-3" />
                          <span>
                            {t("tabs.artifacts.obtainedAt", {
                              date: formatDate(artifact.obtainedAt!, locale),
                            })}
                          </span>
                        </div>
                        <p className="text-primary text-sm">
                          {t("tabs.artifacts.hunt", {
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
                      {t("tabs.artifacts.cta.view")}
                      <View className="size-5" />
                    </Button>
                  </div>
                </motion.div>
              ))}

              {showArtifact && artifactId && (
                <HuntRewardPill key={artifactId} artifactId={artifactId} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default UserProfilePage
