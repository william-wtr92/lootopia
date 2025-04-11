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
} from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  MapPin,
  Calendar,
  Trophy,
  Award,
  Clock,
  MapPinned,
  Amphora,
} from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { getArtifacts, getRecentHunts } from "./mock-data"
import { config } from "@client/env"
import ReportForm from "@client/web/components/features/reports/ReportForm"
import { getUserByNickname } from "@client/web/services/users/getUserByNickname"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import { getArtifactRarityColor } from "@client/web/utils/def/colors"
import { formatDate } from "@client/web/utils/helpers/formatDate"

const UserProfilePage = () => {
  const t = useTranslations("Pages.Users.UserProfile")
  const { nickname } = useParams<{ nickname: string }>()

  const [activeTab, setActiveTab] = useState("hunts")

  const { data: userLoggedIn } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserLoggedIn(),
  })

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile", nickname],
    queryFn: () => getUserByNickname({ nickname }),
    enabled: !!nickname,
  })
  const recentHunts = getRecentHunts()
  const artifacts = getArtifacts()

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const rarityOrder = { legendary: 1, epic: 2, rare: 3, uncommon: 4, common: 5 }
  const sortedArtifacts = [...artifacts].sort(
    (a, b) =>
      rarityOrder[a.rarity as keyof typeof rarityOrder] -
      rarityOrder[b.rarity as keyof typeof rarityOrder]
  )

  if (!userProfile || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-primary">{t("loading")}</p>
      </div>
    )
  }

  return (
    <main className="container relative z-10 mx-auto px-4 py-8">
      <Card className="border-primary mb-8 overflow-hidden">
        <div className="relative">
          <div className="from-primary to-secondary flex h-32 items-center justify-between bg-gradient-to-r px-4 md:px-6">
            <div className="relative top-2 flex gap-4">
              <Image
                src={
                  userProfile.avatar
                    ? config.blobUrl + userProfile.avatar
                    : "/avatar-placeholder.png"
                }
                alt="Avatar"
                width={60}
                height={60}
                className="relative top-1 size-16 rounded-full bg-white object-contain p-1"
              />

              <h1 className="flex flex-col items-start justify-start gap-2 text-3xl font-bold">
                {userProfile.nickname}
                <Badge className="bg-accent text-primary">
                  {t("level", {
                    level: 23, // TD: replace with actual level
                  })}
                </Badge>
              </h1>
            </div>

            {userLoggedIn?.id !== userProfile.id && (
              <ReportForm userNickname={userProfile.nickname} />
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
                    date: formatDate(userProfile.createdAt),
                  })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Level", value: 22 },
                { label: "Hunts", value: 30 },
                { label: "Artifacts", value: 40 },
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
                  nickname: userProfile.nickname,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recentHunts.map((hunt) => (
                <motion.div
                  key={hunt.id}
                  className="border-primary flex items-center gap-4 rounded-lg border p-4 hover:bg-white/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MapPinned className="text-primary size-10" />
                  <div className="flex-grow">
                    <h3 className="text-primary mb-2 font-bold">
                      {hunt.title}
                    </h3>
                    <div className="text-primary grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{hunt.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(hunt.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{hunt.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        <span>{hunt.reward}</span>
                      </div>
                    </div>
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
                  nickname: userProfile.nickname,
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
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Amphora className="text-primary size-8" />
                    </div>
                    <div>
                      <h3 className="text-primary mb-1 flex items-center gap-2 font-bold">
                        <span>{artifact.name}</span>
                        <Badge
                          className={`text-xs ${getArtifactRarityColor(artifact.rarity as ArtifactRarity)}`}
                        >
                          {artifact.rarity}
                        </Badge>
                      </h3>
                      <div className="text-primary mb-1 flex items-center gap-1 text-xs">
                        <Award className="size-3" />
                        <span>
                          Found on {formatDate(artifact.acquiredDate)}
                        </span>
                      </div>
                      <p className="text-primary text-sm">
                        {artifact.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default UserProfilePage
