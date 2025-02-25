import Cookies from "js-cookie"

export const getCookie = (name: string) => Cookies.get(name)
export const setCookie = (
  name: string,
  value: string,
  options?: Cookies.CookieAttributes
) => Cookies.set(name, value, options)
export const delCookie = (name: string, options?: Cookies.CookieAttributes) =>
  Cookies.remove(name, options)
