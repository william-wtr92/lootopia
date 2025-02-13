import { z } from "zod"
import { chestSchema } from "./chests"

export const huntSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
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
