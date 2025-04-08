// ERROR MESSAGES

export const crownPackageNotFound = {
  result: "Crown package not found.",
  key: "crownPackageNotFound",
} as const

export const crownPackageStripeError = {
  result: "Crown package stripe error.",
  key: "crownPackageStripeError",
} as const

export const sessionMetadataError = {
  result: "Session metadata error.",
  key: "sessionMetadataError",
} as const

export const sessionNotFound = {
  result: "Session not found.",
  key: "sessionNotFound",
} as const

export const webhookSignatureError = {
  result: "Webhook signature verification failed.",
  key: "webhookSignatureError",
} as const

// SUCCESS MESSAGES

export const crownPackageStripeSuccess = (clientSecret: string) =>
  ({
    result: clientSecret,
    key: "crownPackageStripeSuccess",
  }) as const

export const paymentRegisteredSuccess = {
  result: "Payment registered.",
  key: "paymentRegisteredSuccess",
} as const
