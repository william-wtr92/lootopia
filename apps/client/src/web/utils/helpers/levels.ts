import { defaultXP, xpRequired } from "@lootopia/common"

export const nextLevelXP = (currentLevel: number | undefined) => {
  if (typeof currentLevel !== "number") {
    return defaultXP
  }

  return xpRequired(currentLevel + 1)
}

export const xpProgress = (
  currentXP: number,
  currentLevel: number | undefined
) => {
  if (typeof currentLevel !== "number") {
    return defaultXP
  }

  return Math.min((currentXP / xpRequired(currentLevel + 1)) * 100, 100)
}
