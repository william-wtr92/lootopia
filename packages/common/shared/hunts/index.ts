import { z } from "zod"

export const huntSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End date must be a valid date.",
  }),
  mode: z.boolean().default(true),
  maxParticipants: z
    .number()
    .int()
    .min(0, { message: "Number of participants must be greater than 0." })
    .optional()
    .nullable(),
})

export type HuntSchema = z.infer<typeof huntSchema>
