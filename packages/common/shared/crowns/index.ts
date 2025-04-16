export const transactionTypes = {
  huntParticipation: "hunt_participation",
  huntCreation: "hunt_creation",
  huntDigging: "hunt_digging",
  hintPurchase: "hint_purchase",
} as const

export type TransactionType =
  (typeof transactionTypes)[keyof typeof transactionTypes]
type TransactionKey = keyof typeof transactionTypes

export const DEFAULT_CROWN_AMOUNT = 50 as const

export const crownCosts: Record<
  Exclude<TransactionKey, "huntDigging">,
  number
> = {
  huntParticipation: 20,
  huntCreation: 50,
  hintPurchase: 5,
}
