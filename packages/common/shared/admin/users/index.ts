import { defaultLimit, defaultPage } from "@common/global/pagination"
import { z } from "zod"

export const usersListQuerySchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
  search: z.string().optional(),
  sortingKey: z.string(),
  sortingType: z.enum(["asc", "desc"]),
})

export const usersUpdateActiveSchema = z.object({
  email: z.string().email(),
})
