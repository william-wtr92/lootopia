export * from "./global/status"
export * from "./global/server"
export * from "./global/position"
export * from "./global/pagination"

// Global types

export {
  ROLES,
  type Roles,
  userSchema,
  type UserSchema,
  userNicknameSchema,
  type UserNicknameSchema,
  userSearchQuerySchema,
  type UserSearchQuerySchema,
} from "./users"

// Features types

// Users types
export {
  registerSchema,
  type RegisterSchema,
  type InsertUser,
} from "./users/auth/register"

export {
  emailValidationSchema,
  type EmailValidationSchema,
  resendEmailValidationSchema,
  type ResendEmailValidationSchema,
} from "./users/auth/emailValidation"

export { loginSchema, type LoginSchema } from "./users/auth/login"

export {
  updateSchema,
  type UpdateSchema,
  type UpdateUser,
} from "./users/auth/update"

export {
  requestPasswordResetSchema,
  type RequestPasswordResetSchema,
  passwordResetSchema,
  type PasswordResetSchema,
} from "./users/auth/passwordReset"

export {
  reactivateAccountRequestSchema,
  type ReactivateAccountRequestSchema,
  reactivateAccountConfirmSchema,
  type ReactivateAccountConfirmSchema,
} from "./users/auth/reactivateAccount"

export {
  MFA_ISSUER,
  mfaSchema,
  type MfaSchema,
  mfaLoginSchema,
  type MfaLoginSchema,
} from "./users/auth/mfa"

// Hunts types
export {
  huntSchema,
  type HuntSchema,
  combinedHuntSchema,
  type CombinedHuntSchema,
  huntListQuerySchema,
  type HuntListQuerySchema,
  huntMineListQuerySchema,
  type HuntMineListQuerySchema,
  huntIdSchema,
  type HuntIdSchema,
  huntParticipationStatusQuery,
  type HuntParticipationStatusQuery,
  participatedHuntQuerySchema,
  type ParticipatedHuntQuerySchema,
} from "./hunts"

export { cities, type City, OTHER_CITY_OPTION } from "./hunts/utils/cities"
export { calculateHuntRange } from "./hunts/utils/calculateHuntRange"

// Chests types
export {
  chestSchema,
  type ChestSchema,
  type ChestRewardType,
  CHEST_REWARD_TYPES,
  MAX_CROWN_REWARD,
  MAX_USERS_PER_CHEST,
} from "./hunts/chests"

// Artifacts types
export {
  ACCEPTED_FILE_TYPES,
  artifactUploadSchema,
  type ArtifactUploadSchema,
  artifactSchema,
  type ArtifactSchema,
  artifactParamSchema,
  type ArtifactParamSchema,
  artifactRarity,
  ARTIFACT_RARITY_TIERS,
  type ArtifactRarity,
  artifactInventoryQuerySchema,
  type ArtifactInventoryQuerySchema,
} from "./artifacts"

export {
  historyStatus,
  type HistoryStatus,
  artifactHistoryQuerySchema,
  type ArtifactHistoryQuerySchema,
  userArtifactParamSchema,
  type UserArtifactParamSchema,
} from "./artifacts/history"

export { getRarityFromAvailability } from "./artifacts/utils/getRarityFromAvailability"

// Crowns types
export {
  transactionTypes,
  type TransactionType,
  DEFAULT_CROWN_AMOUNT,
  crownCosts,
  offerPaymentFee,
} from "./crowns"

// Reports types
export {
  reportReasons,
  type ReportReason,
  reportStatus,
  type ReportStatus,
  ACCEPTED_ATTATCHMENT_FILE_TYPES,
  reportSchema,
  type ReportSchema,
  reportListQuerySchema,
  type ReportListQuerySchema,
} from "./reports"

// Shop types
export {
  crownPackageName,
  type CrownPackageName,
  crownPackageSchema,
  type CrownPackageSchema,
  packageIdSchema,
  type PackageIdSchema,
  sessionIdSchema,
  type SessionIdSchema,
  stripeSignatureSchema,
  type StripeSignatureSchema,
  stripeReturnUrlParams,
  type StripeReturnUrlParams,
} from "./shop"

export {
  paymentStatus,
  type PaymentStatus,
  paymentListQuerySchema,
  type PaymentListQuerySchema,
} from "./shop/payments"

export { calculateDiscountedPrice } from "./shop/utils/calculateDiscountedPrice"

// Participations types
export {
  defaultParticipationRequestCount,
  participationRequestStatus,
  type ParticipationRequestStatus,
  participationRequestsQuerySchema,
  type ParticipationRequestsQuerySchema,
  participationRequestIds,
  type ParticipationRequestIds,
} from "./participations"

// Progressions types
export {
  defaultLevel,
  defaultXP,
  XP_REWARDS,
  xpRequired,
} from "./progressions/levels"

// Town Hall types
export { artifactOfferIdParam, type ArtifactOfferIdParam } from "./town-hall"

export {
  MINIMUM_OFFER_PRICE,
  DURATIONS_IN_DAYS,
  offerStatus,
  type OfferStatus,
  offerFilters,
  type OfferFilters,
  artifactOfferSchema,
  type ArtifactOfferSchema,
  artifactOfferAvailabilityQuerySchema,
  type ArtifactOfferAvailabilityQuerySchema,
  artifactOffersQuerySchema,
  type ArtifactOffersQuerySchema,
} from "./town-hall/offers"

export {
  artifactOfferFavoritesSchema,
  type ArtifactOfferFavoritesSchema,
} from "./town-hall/favorites"
