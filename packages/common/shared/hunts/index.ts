import { z } from "zod"
import { baseChestSchema } from "./chests"
import { defaultLimit, defaultPage } from "@common/global/pagination"

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
  public: z.boolean().default(true),
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
  chests: z.array(baseChestSchema.omit({ id: true })),
})

export type CombinedHuntSchema = z.infer<typeof combinedHuntSchema>

export const huntIdSchema = z.object({
  huntId: z.string().uuid(),
})

export type HuntIdSchema = z.infer<typeof huntIdSchema>

const huntBaseQuerySchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
})

export const huntListQuerySchema = huntBaseQuerySchema.extend({
  name: z.string().optional(),
  city: z.string().optional(),
})

export type HuntListQuerySchema = z.infer<typeof huntListQuerySchema>

export const huntMineListQuerySchema = huntBaseQuerySchema.extend({
  search: z.string().optional(),
})

export type HuntMineListQuerySchema = z.infer<typeof huntMineListQuerySchema>

export const huntParticipationStatusQuery = {
  started: "started",
  upcoming: "upcoming",
} as const

export type HuntParticipationStatusQuery =
  (typeof huntParticipationStatusQuery)[keyof typeof huntParticipationStatusQuery]

export const participatedHuntQuerySchema = huntBaseQuerySchema.extend({
  search: z.string().optional(),
  status: z
    .enum([
      huntParticipationStatusQuery.started,
      huntParticipationStatusQuery.upcoming,
    ])
    .optional(),
})

export type ParticipatedHuntQuerySchema = z.infer<
  typeof participatedHuntQuerySchema
>
