import { locales } from "@client/i18n/routing"

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

export const formatOfferCrowns = (amount: number | null): string => {
  if (!amount) {
    return "0"
  }

  const formatter = new Intl.NumberFormat(locales[1])

  if (amount < 100_000) {
    return formatter.format(amount)
  }

  if (amount < 1_000_000) {
    return `${(amount / 1_000).toLocaleString(locales[1], {
      maximumFractionDigits: 1,
    })}k`
  }

  return `${(amount / 1_000_000).toLocaleString(locales[1], {
    maximumFractionDigits: amount >= 10_000_000 ? 1 : 2,
  })}M`
}
