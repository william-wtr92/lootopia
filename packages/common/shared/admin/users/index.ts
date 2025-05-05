import { defaultLimit, defaultPage } from "@common/global/pagination"
import { orderType } from "@common/global/sorting"
import { z } from "zod"

export const usersListQuerySchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
  search: z.string().optional(),
  sortingKey: z.string(),
  sortingType: z.enum([orderType.asc, orderType.desc]),
})

export const usersUpdateActiveSchema = z.object({
  email: z.string().email(),
})

export type UsersListQuerySchema = z.infer<typeof usersListQuerySchema>

export type UsersUpdateActiveSchema = z.infer<typeof usersUpdateActiveSchema>
