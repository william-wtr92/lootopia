import {
  ARTIFACT_RARITY_TIERS,
  type ArtifactRarityTier,
} from "@common/artifacts"

export const getRarityFromAvailability = (
  availability: number
): ArtifactRarityTier => {
  for (const [key, max] of Object.entries(ARTIFACT_RARITY_TIERS)) {
    if (availability <= max) return key as ArtifactRarityTier
  }
  return "common"
}
