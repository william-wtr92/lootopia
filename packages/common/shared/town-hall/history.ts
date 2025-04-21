export const historyStatus = {
  discovery: "discovery",
  transfer: "transfer",
  listing: "listing",
} as const

export type HistoryStatus = (typeof historyStatus)[keyof typeof historyStatus]
