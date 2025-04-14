import { stripeReturnUrlParams } from "@lootopia/common"
import appConfig from "@server/config"
import { clientRoutes } from "@server/utils/router"

export const buildStripeProductDataName = (crowns: number) => {
  return `Lootopia Package - ${crowns} 👑`
}

export const buildStripeReturnUrl = () => {
  const { success, sessionId } = stripeReturnUrlParams

  return `${appConfig.security.cors.origin}${clientRoutes.shop.return}?${success}=true&${sessionId}={CHECKOUT_SESSION_ID}`
}
