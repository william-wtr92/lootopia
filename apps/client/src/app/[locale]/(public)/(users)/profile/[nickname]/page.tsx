"use client"

import {
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import { Calendar } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import { config } from "@client/env"
import ReportForm from "@client/web/components/features/reports/ReportForm"
import ProfileArtifacts from "@client/web/components/features/users/profile/stats/ProfileArtifacts"
import ProfileHunts from "@client/web/components/features/users/profile/stats/ProfileHunts"
import { getUserByNickname } from "@client/web/services/users/getUserByNickname"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import { formatDate } from "@client/web/utils/helpers/formatDate"

const UserProfilePage = () => {
  const t = useTranslations("Pages.Users.UserProfile")
  const locale = useLocale()

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

  const recentHunts = userProfile?.hunts || []
  const sortedArtifacts = userProfile?.artifacts || []

  const handleTabChange = (value: string) => {
    setActiveTab(value)
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
          <ProfileHunts
            nickname={userProfile.user.nickname}
            recentHunts={recentHunts}
          />
        </TabsContent>

        <TabsContent value="artifacts">
          <ProfileArtifacts
            nickname={userProfile.user.nickname}
            recentArtifacts={sortedArtifacts}
          />
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default UserProfilePage
