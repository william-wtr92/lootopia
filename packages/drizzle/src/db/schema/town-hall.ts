import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { userArtifacts } from "./artifacts"
import {
  historyStatus,
  type HistoryStatus,
  type OfferStatus,
} from "@lootopia/common"
import { hunts } from "./hunts"

export const artifactOffers = pgTable("artifact_offers", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  sellerId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userArtifactId: uuid()
    .notNull()
    .references(() => userArtifacts.id, { onDelete: "cascade" }),
  price: text().notNull(),
  description: text(),
  status: text("status").$type<OfferStatus>().notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
})

export const artifactOfferViews = pgTable(
  "artifact_offer_views",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    offerId: uuid()
      .notNull()
      .references(() => artifactOffers.id, { onDelete: "cascade" }),
    viewerId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("artifact_offer_views_unique").on(
      table.offerId,
      table.viewerId
    ),
  ]
)

export const artifactOfferFavorites = pgTable(
  "artifact_offer_favorites",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    offerId: uuid()
      .notNull()
      .references(() => artifactOffers.id, { onDelete: "cascade" }),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    favoritedAt: timestamp("favorited_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueFavorite: uniqueIndex("unique_favorite_per_user_offer").on(
      table.offerId,
      table.userId
    ),
  })
)

export const artifactOwnershipHistory = pgTable("artifact_ownership_history", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userArtifactId: uuid()
    .notNull()
    .references(() => userArtifacts.id, { onDelete: "cascade" }),
  type: text("type")
    .$type<HistoryStatus>()
    .notNull()
    .default(historyStatus.discovery),
  previousOwnerId: uuid().references(() => users.id, { onDelete: "cascade" }),
  newOwnerId: uuid().references(() => users.id, { onDelete: "cascade" }),
  huntId: uuid().references(() => hunts.id, {
    onDelete: "cascade",
  }),
  //TD: Probably should changed to CreatedAt
  transferredAt: timestamp("transferred_at").notNull().defaultNow(),
})
