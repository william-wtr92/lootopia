import { artifactRarity } from "@common/artifacts"
import { defaultLimit, defaultPage } from "@common/global/pagination"
import { z } from "zod"

export const MINIMUM_OFFER_PRICE = 50 as const

export const DURATIONS_IN_DAYS = ["3", "7", "14", "30"] as const

export const offerStatus = {
  active: "active",
  sold: "sold",
  expired: "expired",
  cancelled: "cancelled",
} as const

export type OfferStatus = (typeof offerStatus)[keyof typeof offerStatus]

export const offerFilters = {
  latest: "latest",
  priceAsc: "price-asc",
  priceDesc: "price-desc",
  rarity: "rarity",
  favorites: "favorites",
} as const

export type OfferFilters = (typeof offerFilters)[keyof typeof offerFilters]

export const artifactOfferSchema = z.object({
  userArtifactId: z.string().uuid().min(1),
  price: z.number().min(1),
  duration: z.enum(DURATIONS_IN_DAYS),
  description: z.string().optional(),
})

export type ArtifactOfferSchema = z.infer<typeof artifactOfferSchema>

export const artifactOfferAvailabilityQuerySchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
  search: z.string().optional(),
})

export type ArtifactOfferAvailabilityQuerySchema = z.infer<
  typeof artifactOfferAvailabilityQuerySchema
>

export const artifactOffersQuerySchema = z.object({
  limit: z.string().optional().default(defaultLimit.toString()).optional(),
  page: z.string().optional().default(defaultPage.toString()),
  search: z.string().optional(),
  filters: z
    .enum([
      artifactRarity.legendary,
      artifactRarity.epic,
      artifactRarity.rare,
      artifactRarity.uncommon,
      artifactRarity.common,
    ])
    .optional(),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => val === undefined || (!isNaN(Number(val)) && Number(val) > 0)
    ),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => val === undefined || (!isNaN(Number(val)) && Number(val) > 0)
    ),
  sortBy: z
    .enum([
      offerFilters.latest,
      offerFilters.priceAsc,
      offerFilters.priceDesc,
      offerFilters.rarity,
      offerFilters.favorites,
    ])
    .optional()
    .default(offerFilters.latest),
})

export type ArtifactOffersQuerySchema = z.infer<
  typeof artifactOffersQuerySchema
>
