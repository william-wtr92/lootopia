export const transactionTypes = {
  huntParticipation: "hunt_participation",
  huntCreation: "hunt_creation",
  artifactPurchase: "artifact_purchase",
} as const

export type TransactionType =
  (typeof transactionTypes)[keyof typeof transactionTypes]
type TransactionKey = keyof typeof transactionTypes

export const DEFAULT_CROWN_AMOUNT = 50 as const

export const crownCosts: Record<TransactionKey, number> = {
  huntParticipation: 20,
  huntCreation: 50,
  artifactPurchase: 100,
}
