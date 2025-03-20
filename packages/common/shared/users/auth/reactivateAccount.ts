import { z } from "zod"

export const reactivateAccountRequestSchema = z.object({
  email: z.string().email(),
})

export type ReactivateAccountRequestSchema = z.infer<
  typeof reactivateAccountRequestSchema
>

export const reactivateAccountConfirmSchema = z.object({
  token: z.string().min(1),
})

export type ReactivateAccountConfirmSchema = z.infer<
  typeof reactivateAccountConfirmSchema
>
