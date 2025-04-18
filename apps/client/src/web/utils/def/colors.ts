import {
  type PaymentStatus,
  type ReportStatus,
  type ReportReason,
  reportReasons,
  reportStatus,
  type ArtifactRarity,
  artifactRarity,
  paymentStatus,
  type CrownPackageName,
  crownPackageName,
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

export const getPaymentStatusColor = (status: PaymentStatus) => {
  return cva("text-white", {
    variants: {
      status: {
        [paymentStatus.paid]: "bg-success hover:bg-success/80",
        [paymentStatus.noPaymentRequired]: "bg-amber-500 hover:bg-amber-600",
        [paymentStatus.unpaid]: "bg-error hover:bg-error/80",
      },
    },
    defaultVariants: {
      status: paymentStatus.unpaid,
    },
  })({ status })
}

export const getCrownPackageColor = (name: CrownPackageName) => {
  return cva("text-white", {
    variants: {
      name: {
        [crownPackageName.starterPack]:
          "bg-gradient-to-r from-amber-400 to-amber-600",
        [crownPackageName.explorerPack]:
          "bg-gradient-to-r from-blue-400 to-blue-600",
        [crownPackageName.adventurerPack]:
          "bg-gradient-to-r from-purple-500 to-purple-700",
        [crownPackageName.treasureHunterPack]:
          "bg-gradient-to-r from-emerald-400 to-emerald-600",
        [crownPackageName.legendaryPack]:
          "bg-gradient-to-r from-rose-500 to-rose-700",
      },
    },
    defaultVariants: {
      name: crownPackageName.starterPack,
    },
  })({ name })
}

export const getRewardPillRarityColor = (rarity: ArtifactRarity) => {
  return cva("", {
    variants: {
      rarity: {
        [artifactRarity.common]: "bg-white text-black",
        [artifactRarity.uncommon]: "bg-green-500 text-white",
        [artifactRarity.rare]: "bg-blue-500 text-white",
        [artifactRarity.epic]: "bg-purple-500 text-white",
        [artifactRarity.legendary]: "bg-amber-400 text-white",
      },
    },
    defaultVariants: {
      rarity: artifactRarity.common,
    },
  })({ rarity })
}
