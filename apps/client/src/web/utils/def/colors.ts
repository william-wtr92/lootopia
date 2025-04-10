import {
  type ReportStatus,
  type ReportReason,
  reportReasons,
  reportStatus,
  type ArtifactRarity,
  artifactRarity,
} from "@lootopia/common"
import { cva } from "class-variance-authority"

export const getReportReasonColor = (reason: ReportReason) => {
  return cva("text-white", {
    variants: {
      reason: {
        [reportReasons.cheating]: "bg-yellow-500 hover:bg-yellow-600",
        [reportReasons.harassment]: "bg-orange-500 hover:bg-orange-600",
        [reportReasons.inappropriateBehavior]: "bg-red-500 hover:bg-red-600",
        [reportReasons.impersonation]: "bg-red-700 hover:bg-red-800",
        [reportReasons.other]: "bg-blue-500 hover:bg-blue-600",
      },
    },
    defaultVariants: {
      reason: reportReasons.other,
    },
  })({ reason })
}

export const getReportStatusColor = (status: ReportStatus) => {
  return cva("text-white", {
    variants: {
      status: {
        [reportStatus.pending]: "bg-amber-500 hover:bg-amber-600",
        [reportStatus.resolved]: "bg-success hover:bg-success/80",
        [reportStatus.rejected]: "bg-error hover:bg-error/80",
      },
    },
    defaultVariants: {
      status: reportStatus.pending,
    },
  })({ status })
}

export const getArtifactRarityColor = (rarity: ArtifactRarity) => {
  return cva("text-white", {
    variants: {
      rarity: {
        [artifactRarity.legendary]: "bg-amber-500 hover:bg-amber-600",
        [artifactRarity.epic]: "bg-purple-600 hover:bg-purple-700",
        [artifactRarity.rare]: "bg-blue-600 hover:bg-blue-700",
        [artifactRarity.uncommon]: "bg-green-600 hover:bg-green-700",
        [artifactRarity.common]: "bg-gray-500 hover:bg-gray-600",
      },
    },
    defaultVariants: {
      rarity: artifactRarity.common,
    },
  })({ rarity })
}
