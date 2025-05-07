import { ARTIFACT_RARITY_TIERS, type ArtifactRarity } from "@common/artifacts"

export const getRarityFromAvailability = (
  availability: number
): ArtifactRarity => {
  for (const [key, max] of Object.entries(ARTIFACT_RARITY_TIERS)) {
    if (availability <= max) return key as ArtifactRarity
  }
  return "common"
}
