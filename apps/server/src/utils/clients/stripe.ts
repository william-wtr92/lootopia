import appConfig from "@server/config"
import Stripe from "stripe"

export const stripe = new Stripe(appConfig.stripe.secret)
