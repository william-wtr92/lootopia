"use client"

import { Button } from "@lootopia/ui"
import { Amphora } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect } from "react"

import { Link } from "@client/i18n/routing"
import HuntRewardPill from "@client/web/components/features/hunts/list/rewards/HuntRewardPill"
import { routes } from "@client/web/routes"

const ArtifactViewerPage = () => {
  const t = useTranslations("Pages.Artifacts.Viewer")

  const params = useParams()
  const router = useRouter()

  const artifactId =
    typeof params.artifactId === "string" ? params.artifactId : null

  useEffect(() => {
    if (!artifactId) {
      router.replace(routes.home)
    }
  }, [artifactId, router])

  if (!artifactId) {
    return null
  }

  return (
    <main className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-primary mb-6 text-4xl font-bold">{t("title")}</h1>

        <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <div className="mb-6 flex justify-center">
            <div className="bg-primary flex h-20 w-20 items-center justify-center rounded-full">
              <Amphora className="text-accent size-10" />
            </div>
          </div>

          <p className="text-primary mb-6 text-lg">{t("description")}</p>

          <Button className="bg-primary text-accent hover:bg-secondary">
            <Link href={routes.home}>{t("cta.home")}</Link>
          </Button>
        </div>

        <HuntRewardPill artifactId={artifactId} />
      </div>
    </main>
  )
}

export default ArtifactViewerPage
