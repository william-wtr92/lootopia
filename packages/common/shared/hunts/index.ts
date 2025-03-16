import { z } from "zod"
import { chestSchema } from "./chests"

export const defaultLimit = 10
export const defaultPage = 0

export const huntSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  city: z.string().min(3),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start date must be a valid date.",
  }),
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

export const combinedHuntSchema = z.object({
  hunt: huntSchema,
  chests: z.array(chestSchema.omit({ id: true })),
})

export type CombinedHuntSchema = z.infer<typeof combinedHuntSchema>
