export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }

  const formattedDate = date.toLocaleDateString("fr-FR", options)

  return formattedDate.replace(/\b\p{L}/u, (char) => char.toUpperCase())
}
