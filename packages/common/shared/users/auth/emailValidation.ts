import { z } from "zod"

export const emailValidationSchema = z.object({
  token: z.string(),
})

export type EmailValidationSchema = z.infer<typeof emailValidationSchema>

export const resendEmailValidationSchema = z.object({
  email: z.string().email(),
})

export type ResendEmailValidationSchema = z.infer<
  typeof resendEmailValidationSchema
>
