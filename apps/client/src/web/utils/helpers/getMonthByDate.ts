import { capitalizeFirstLetter } from "./capitalizeFirstLetter"

export const getMonthByDate = (locale: string, date: string) => {
  const month = new Date(date).toLocaleString(locale, {
    month: "long",
  })

  return capitalizeFirstLetter(month)
}
