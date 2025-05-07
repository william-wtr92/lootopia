import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lootopia/ui"
import { motion } from "framer-motion"
import { Calendar, MapPin, MapPinned, MapPinX, Swords } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import type { UserStatisticsResponse } from "@client/web/services/users/getUserByNickname"
import { formatDate } from "@client/web/utils/helpers/formatDate"

type Props = {
  nickname: string
  recentHunts: UserStatisticsResponse["hunts"]
}

const ProfileHunts = ({ nickname, recentHunts }: Props) => {
  const t = useTranslations("Components.Users.Profile.Stats.ProfileHunts")
  const locale = useLocale()

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
      <CardContent className="space-y-6">
        {recentHunts.length > 0 ? (
          <>
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
                      <span className="line-clamp-2">{hunt?.description}</span>
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
          </>
        ) : (
          <div className="text-primary flex h-24 items-center justify-center gap-4">
            <MapPinX className="size-6" />
            <span className="font-semibold">{t("empty")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ProfileHunts
