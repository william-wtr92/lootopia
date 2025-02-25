import { z } from "zod"

export const requestPasswordResetSchema = z.object({
  email: z.string().email(),
})

export type RequestPasswordResetSchema = z.infer<
  typeof requestPasswordResetSchema
>

export const passwordResetSchema = z
  .object({
    token: z.string(),
    password: z.string().nonempty("Password is required."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type PasswordResetSchema = z.infer<typeof passwordResetSchema>
