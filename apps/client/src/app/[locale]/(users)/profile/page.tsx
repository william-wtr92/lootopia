"use client"

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from "@lootopia/ui"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { LogOutIcon, MapPin, Settings, Star, Trophy } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { config } from "@client/env"
import { routes } from "@client/utils/routes"
import EditProfileForm from "@client/web/components/features/users/profile/EditProfileForm"
import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import { logout } from "@client/web/services/auth/logout"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import anim from "@client/web/utils/anim"

const ProfilePage = () => {
  const t = useTranslations("Pages.Users.Profile")
  const router = useRouter()

  const qc = useQueryClient()
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserLoggedIn(),
  })

  const user = data ? data : undefined

  const profileHeaderVariant = {
    initial: { opacity: 0, y: 20 },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const statsCardVariant = {
    initial: { opacity: 0, x: -20 },
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  }

  const progressCardVariant = {
    initial: {
      opacity: 0,
      x: -20,
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0,
        delay: 0.4,
      },
    },
  }

  const bottomButtonsVariant = {
    initial: {
      opacity: 0,
      y: 20,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.6,
      },
    },
  }

  const logoutUser = async () => {
    await logout()

    router.push(routes.auth.login)

    qc.invalidateQueries({ queryKey: ["user"] })
  }

  return (
    <main className="relative z-10 flex w-full flex-1 flex-col gap-8 px-4 py-8">
      <MotionComponent {...anim(profileHeaderVariant)}>
        <Card className="flex justify-between">
          <CardContent className="flex items-center gap-6 pt-6">
            <Image
              src={
                user?.avatar
                  ? config.blobUrl + user.avatar
                  : "/avatar-placeholder.png"
              }
              alt="Avatar"
              width={100}
              height={100}
              className="aspect-square rounded-full"
            />
            <div>
              <h1 className="text-primary text-3xl font-bold">
                {user?.nickname}
              </h1>
              <p className="text-secondary">{user?.role}</p>
            </div>
          </CardContent>

          <div className="mb-6 mr-6 flex flex-col gap-2 self-end">
            {user && <EditProfileForm user={user} />}

            <Button onClick={logoutUser}>
              <LogOutIcon /> {t("cta.logout")}
            </Button>
          </div>
        </Card>
      </MotionComponent>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <MotionComponent {...anim(statsCardVariant)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                {t("statistics.title")}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-primary">
                    {t("statistics.treasuresFound")}
                  </span>
                  <span className="text-primary font-bold">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary">
                    {t("statistics.challengesCompleted")}
                  </span>
                  <span className="text-primary font-bold">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary">{t("statistics.xp")}</span>
                  <span className="text-primary font-bold">1337</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionComponent>

        <MotionComponent {...anim(progressCardVariant)}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-primary">
                {t("progress.title")}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-primary">
                      {t("progress.currentLevel")}
                    </span>
                    <span className="text-primary font-bold">7</span>
                  </div>
                  <Progress value={70} className="bg-secondaryBg h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-primary">
                      {t("progress.nextTrophy")}
                    </span>
                    <span className="text-primary font-bold">3/5</span>
                  </div>
                  <Progress value={60} className="bg-secondaryBg h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionComponent>
      </div>

      <MotionComponent
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        {...anim(bottomButtonsVariant)}
      >
        <Button>
          <MapPin className="mr-2 h-4 w-4" /> {t("cta.treasureMap")}
        </Button>
        <Button>
          <Trophy className="mr-2 h-4 w-4" /> {t("cta.trophies")}
        </Button>
        <Button>
          <Star className="mr-2 h-4 w-4" /> {t("cta.leaderboard")}
        </Button>
        <Button>
          <Settings className="mr-2 h-4 w-4" /> {t("cta.settings")}
        </Button>
      </MotionComponent>
    </main>
  )
}

export default ProfilePage
