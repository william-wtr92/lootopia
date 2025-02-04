import { z } from "zod"

export const emailValidationSchema = z.object({
  token: z.string(),
})

export type EmailValidationSchema = z.infer<typeof emailValidationSchema>
