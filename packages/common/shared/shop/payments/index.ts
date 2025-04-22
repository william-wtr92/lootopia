import { defaultLimit, defaultPage } from "@common/global/pagination"
import { z } from "zod"

export const paymentStatus = {
  noPaymentRequired: "no_payment_required",
  paid: "paid",
  unpaid: "unpaid",
} as const

export type PaymentStatus = (typeof paymentStatus)[keyof typeof paymentStatus]

export const paymentListQuerySchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
  search: z.string().optional(),
})

export type PaymentListQuerySchema = z.infer<typeof paymentListQuerySchema>
