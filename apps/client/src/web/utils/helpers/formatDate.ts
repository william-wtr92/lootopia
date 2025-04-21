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
