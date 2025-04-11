import { z } from "zod"

const DEFAULT_CHEST_SIZE = 80 as const

export const MAX_CROWN_REWARD = 100 as const

export const CHEST_REWARD_TYPES = {
  artifact: "artifact",
  crown: "crown",
} as const

export type ChestRewardType =
  (typeof CHEST_REWARD_TYPES)[keyof typeof CHEST_REWARD_TYPES]

export const baseChestSchema = z.object({
  id: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  description: z.string().optional(),
  rewardType: z.enum(Object.values(CHEST_REWARD_TYPES) as [ChestRewardType]),
  reward: z.union([
    z
      .string()
      .min(1)
      .refine((val) => isNaN(Number(val)), {
        message: "Reward must be a string for artifacts",
      }),
    z.number().int().min(1).max(MAX_CROWN_REWARD),
  ]),
  size: z.number().default(DEFAULT_CHEST_SIZE),
  maxUsers: z.number().int().min(1).default(1),
  visibility: z.boolean().default(false),
})

export const chestSchema = baseChestSchema.refine(
  (data) => {
    if (data.rewardType === "crown") {
      return typeof data.reward === "number"
    } else {
      return typeof data.reward === "string"
    }
  },
  {
    message: "Reward type and reward value mismatch",
    path: ["reward"],
  }
)
export type ChestSchema = z.infer<typeof chestSchema>
