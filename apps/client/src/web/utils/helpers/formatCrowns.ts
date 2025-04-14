export const formatCrowns = (amount: number | null): string => {
  if (amount === null) {
    return "0"
  }

  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)} M`
  }

  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1)} k`
  }

  return amount.toString()
}
