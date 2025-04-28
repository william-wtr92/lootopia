import { locales } from "@client/i18n/routing"

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat(locales[1], {
    style: "currency",
    currency: "EUR",
  }).format(number)
}
