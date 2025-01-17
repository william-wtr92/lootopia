import { z } from "zod"

export const registerSchema = z
  .object({
    avatar: z.instanceof(File),
    nickname: z
      .string()
      .min(1, "Nickname is required.")
      .max(255, "Nickname cannot exceed 255 characters."),
    email: z
      .string()
      .email("Invalid email address.")
      .max(255, "Email cannot exceed 255 characters."),
    phone: z
      .string()
      .min(1, "Phone number is required.")
      .max(255, "Phone number cannot exceed 255 characters."),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters long.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    confirmPassword: z.string(),
    birthdate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Birthdate must be a valid date.",
    }),
    gdprValidated: z
      .string()
      .transform((val) => val === "true")
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions (GDPR).",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type RegisterSchema = z.infer<typeof registerSchema>
export type InsertUser = Omit<RegisterSchema, "password" | "confirmPassword">
