"use client"

import type { ArtifactRarity } from "@lootopia/common"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Badge,
} from "@lootopia/ui"
import { Gem, Link, View, Check, Link2, Copy, CopyCheck } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import { env } from "@client/env"
import HuntRewardPill from "@client/web/components/features/hunts/list/rewards/HuntRewardPill"
import { useCopyToClipboard } from "@client/web/hooks/useCopyToClipboard"
import { routes } from "@client/web/routes"
import type { ArtifactInventoryResponse } from "@client/web/services/artifacts/getArtifactInventory"
import { getArtifactRarityColor } from "@client/web/utils/def/colors"
import { formatDate } from "@client/web/utils/helpers/formatDate"

type Props = {
  item: ArtifactInventoryResponse
  open: boolean
  setIsOpen: (open: boolean) => void
}

const InventoryArtifactDetails = ({ item, open, setIsOpen }: Props) => {
  const t = useTranslations(
    "Components.Users.Profile.Inventory.InventoryArtifactDetails"
  )
  const locale = useLocale()
  const { copiedText, copy } = useCopyToClipboard()

  const [showArtifact, setShowArtifact] = useState(false)

  if (!item) {
    return null
  }

  const handleShowArtifact = () => {
    setShowArtifact((prev) => !prev)
  }

  const handleCopyShaKey = () => {
    if (item?.artifact?.shaKey) {
      copy(item.artifact.shaKey)
    }
  }

  const handleCopyLink = () => {
    if (item?.artifact?.id) {
      copy(artifactUrl)
    }
  }

  const artifactUrl = item?.artifact?.id
    ? `${env.NEXT_PUBLIC_CLIENT_URL}${routes.artifacts.viewerDetail(item.artifact.id)}`
    : ""

  return (
    <>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent className="text-primary px-6 py-4 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl font-bold">
              <Gem className="text-secondary mr-2 size-5" />{" "}
              {item.artifact?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="flex justify-center">
              <div
                className={`rounded-lg p-8 ${getArtifactRarityColor(item?.artifact?.rarity as ArtifactRarity)} flex items-center justify-center`}
              >
                <Gem className="size-16" />
              </div>
            </div>

            <div className="rounded-lg border bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("artifact.key")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-primary w-36 truncate text-sm font-bold">
                    {item?.artifact?.shaKey}
                  </span>
                  {copiedText === item?.artifact?.shaKey ? (
                    <CopyCheck className="text-success mr-2 size-4" />
                  ) : (
                    <Copy
                      className="mr-2 size-4 cursor-pointer"
                      onClick={handleCopyShaKey}
                    />
                  )}
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("artifact.rarity")}
                </span>
                <Badge
                  className={`text-xs ${getArtifactRarityColor(item?.artifact?.rarity as ArtifactRarity)}`}
                >
                  {item?.artifact?.rarity}
                </Badge>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("artifact.obtainedAt")}
                </span>
                <span className="font-medium">
                  {formatDate(item?.obtainedAt, locale)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("artifact.hunt")}
                </span>
                <span className="font-medium">{item.huntName}</span>
              </div>
            </div>

            <div>
              <h4 className="text-primary mb-2 flex items-center text-sm font-semibold">
                <Link className="mr-2 size-4" />
                {t("links.view.title")}
              </h4>
              <p className="text-gray-700">{t("links.view.description")}</p>
            </div>

            <div className="relative flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={handleShowArtifact}
              >
                <View className="mr-2 size-4" />
                {t("links.view.cta")}
              </Button>

              <Button
                onClick={handleCopyLink}
                variant="outline"
                className={`border-primary ${copiedText === artifactUrl ? "text-success hover:text-success bg-green-100 hover:bg-transparent" : "text-primary"} relative overflow-hidden transition-all`}
              >
                {copiedText === artifactUrl ? (
                  <>
                    <Check className="mr-2 size-4 animate-bounce" />
                    {t("links.share.cta.copied")}
                    <span className="absolute inset-0 animate-pulse rounded-md"></span>
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 size-4" />
                    {t("links.share.cta.copy")}
                  </>
                )}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-primary hover:bg-secondary text-accent"
            >
              {t("cta.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showArtifact && item?.artifact?.id && (
        <HuntRewardPill artifactId={item.artifact.id} />
      )}
    </>
  )
}

export default InventoryArtifactDetails
