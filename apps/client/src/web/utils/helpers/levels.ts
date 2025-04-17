import { defaultXP, xpRequired } from "@lootopia/common"

export const nextLevelXP = (currentLevel: number | undefined) => {
  if (typeof currentLevel !== "number") {
    return defaultXP
  }

  return xpRequired(currentLevel + 1)
}

export const previousLevelXP = (currentLevel: number | undefined) => {
  if (typeof currentLevel !== "number") {
    return defaultXP
  }

  return xpRequired(currentLevel)
}

export const xpProgress = (
  currentXP: number | undefined,
  previousLevelXP: number | undefined,
  nextLevelXP: number | undefined
) => {
  if (
    typeof currentXP !== "number" ||
    typeof previousLevelXP !== "number" ||
    typeof nextLevelXP !== "number" ||
    nextLevelXP === previousLevelXP
  ) {
    return defaultXP
  }

  return ((currentXP - previousLevelXP) / (nextLevelXP - previousLevelXP)) * 100
}
