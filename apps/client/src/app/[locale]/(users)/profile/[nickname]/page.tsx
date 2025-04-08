"use client"

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
  MapPinnedIcon,
  AmphoraIcon,
} from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { getArtifacts, getRarityColor, getRecentHunts } from "./mock-data"
import { config } from "@client/env"
import ReportDialog from "@client/web/components/features/reports/ReportDialog"
import { getUserByNickname } from "@client/web/services/users/getUserByNickname"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import { formatDate } from "@client/web/utils/formatDate"

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
        <div className="from-primary to-primary h-32 bg-gradient-to-r" />
        <CardContent className="relative pt-0">
          <div className="-mt-20 flex flex-col gap-6 md:flex-row">
            <div className="flex-grow pt-16 md:pt-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <Image
                    src={
                      userProfile.avatar
                        ? config.blobUrl + userProfile.avatar
                        : "/avatar-placeholder.png"
                    }
                    alt="Avatar"
                    width={60}
                    height={60}
                    className="relative bottom-2 size-16 rounded-full bg-white object-contain p-1"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      {userProfile.nickname}
                    </h1>
                    <div className="mt-10 flex flex-col gap-2">
                      <p className="text-xl italic text-[#8A4FFF]">
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
                  </div>
                </div>

                {userLoggedIn?.id !== userProfile.id && (
                  <ReportDialog userNickname={userProfile.nickname} />
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Level", value: 22 },
                  { label: "Hunts", value: 30 },
                  { label: "Artifacts", value: 40 },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="border-primary rounded-lg border bg-white p-2 text-center"
                  >
                    <div className="text-primary text-2xl font-bold">
                      {value}
                    </div>
                    <div className="text-primary text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="border-primary text-primary border bg-white">
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

        <TabsContent value="hunts" className="mt-6">
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
                  <MapPinnedIcon className="text-primary size-10" />
                  <div className="flex-grow">
                    <h3 className="text-primary font-bold">{hunt.title}</h3>
                    <div className="text-primary mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
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

        <TabsContent value="artifacts" className="mt-6">
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
                      <AmphoraIcon className="text-primary size-8" />
                    </div>
                    <div>
                      <h3 className="text-primary flex items-center gap-2 font-bold">
                        <span>{artifact.name}</span>
                        <Badge
                          className={`text-xs ${getRarityColor(artifact.rarity)}`}
                        >
                          {artifact.rarity}
                        </Badge>
                      </h3>
                      <div className="text-primary mt-1 flex items-center gap-1 text-xs">
                        <Award className="h-3 w-3" />
                        <span>
                          Found on {formatDate(artifact.acquiredDate)}
                        </span>
                      </div>
                      <p className="text-primary mt-2 text-sm">
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
