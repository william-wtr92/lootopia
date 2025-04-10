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
  userSearchParamsSchema,
  type UserSearchParamsSchema,
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

// Hunts types
export {
  huntSchema,
  type HuntSchema,
  combinedHuntSchema,
  type CombinedHuntSchema,
  huntIdSchema,
  type HuntIdSchema,
  huntListQuerySchema,
  type HuntListQuerySchema,
  huntMineListQuerySchema,
  type HuntMineListQuerySchema,
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
} from "./hunts/chests"

// Artifacts types
export {
  ACCEPTED_FILE_TYPES,
  artifactUploadSchema,
  type ArtifactUploadSchema,
  artifactSchema,
  type ArtifactSchema,
  artifactRarity,
  ARTIFACT_RARITY_TIERS,
  type ArtifactRarity,
} from "./artifacts"

export { getRarityFromAvailability } from "./artifacts/utils/getRarityFromAvailability"

// Crowns types
export {
  transactionTypes,
  type TransactionType,
  DEFAULT_CROWN_AMOUNT,
  crownCosts,
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
  reportListParamsSchema,
  type ReportListParamsSchema,
} from "./reports"
