export const formatDate = (dateString: string, locale: string) => {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }

  const formattedDate = date.toLocaleDateString(locale, options)

  return formattedDate.replace(/\b\p{L}/u, (char) => char.toUpperCase())
}

export const formatDateTime = (dateString: string, locale: string) => {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }

  const formattedDate = date.toLocaleDateString(locale, options)

  return formattedDate.replace(/\b\p{L}/u, (char) => char.toUpperCase())
}

export const formatDateDiff = (dateString: string, locale: string) => {
  const now = new Date()
  const target = new Date(dateString)

  const diffMs = target.getTime() - now.getTime()
  const diffSeconds = Math.round(diffMs / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  const divisions = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ]

  let duration = diffSeconds
  for (const { amount, unit } of divisions) {
    if (Math.abs(duration) < amount) {
      return rtf.format(
        Math.round(duration),
        unit as Intl.RelativeTimeFormatUnit
      )
    }

    duration /= amount
  }

  return ""
}
