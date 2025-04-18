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
