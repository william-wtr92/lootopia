export const defaultLevel = 1
export const defaultXP = 0

export const xpRequired = (level: number) => {
  const baseXP = 100
  const exponent = 1.5

  return Math.floor(baseXP * Math.pow(level, exponent))
}

export const XP_REWARDS = {
  digSuccess: 100,
  artifactOfferPurchase: 50,
  artifactOfferSold: 70,
} as const
