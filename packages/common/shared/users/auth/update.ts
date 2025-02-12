import { z } from "zod"

export const updateSchema = z
  .object({
    avatar: z
      .union([
        z.instanceof(File),
        z
          .string()
          .optional()
          .transform((val) =>
            val === "" || val === "undefined" ? undefined : val
          ),
        z.undefined(),
      ])
      .optional(),
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
    birthdate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Birthdate must be a valid date.",
    }),
    password: z.union([
      z.literal(""),
      z
        .string()
        .min(12, {
          message: "The password must be at least 12 characters long",
        })
        .regex(/[A-Z]/, {
          message: "The password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
          message: "The password must contain at least one lowercase letter",
        })
        .regex(/[0-9]/, {
          message: "The password must contain at least one number",
        })
        .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, {
          message: "The password must contain at least one special character",
        }),
    ]),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type UpdateSchema = z.infer<typeof updateSchema>
export type UpdateUser = Omit<UpdateSchema, "password" | "confirmPassword">
