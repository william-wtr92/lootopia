export * from "./global/status"
export * from "./global/server"
export * from "./global/position"

// Global types

export { ROLES, type Roles, userSchema, type UserSchema } from "./users"

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

// Hunts types

export {
  huntSchema,
  type HuntSchema,
  combinedHuntSchema,
  type CombinedHuntSchema,
  defaultLimit,
  defaultPage,
} from "./hunts"

export { cities, type City, OTHER_CITY_OPTION } from "./hunts/utils/cities"
export { calculateHuntRange } from "./hunts/utils/calculateHuntRange"

// Chests types
export {
  chestSchema,
  type ChestSchema,
  type ChestRewardType,
  CHEST_REWARD_TYPES,
} from "./hunts/chests"

// Artifacts types
export {
  ACCEPTED_FILE_TYPES,
  artifactUploadSchema,
  type ArtifactUploadSchema,
  artifactSchema,
  type ArtifactSchema,
} from "./artifacts"
