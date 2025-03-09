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

// Hunts types

export {
  huntSchema,
  type HuntSchema,
  combinedHuntSchema,
  type CombinedHuntSchema,
} from "./hunts"

export { cities, type City, OTHER_CITY_OPTION } from "./hunts/utils/cities"
export { calculateHuntRange } from "./hunts/utils/calculateHuntRange"

// Chests types
export { chestSchema, type ChestSchema } from "./hunts/chests"
