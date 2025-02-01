import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(12, "The password must be at least 12 characters long"),
})

export type LoginSchemaType = z.infer<typeof loginSchema>
