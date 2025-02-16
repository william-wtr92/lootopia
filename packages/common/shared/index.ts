export * from "./global/status"
export * from "./global/server"
export * from "./global/position"

// Global types

export { ROLES, type Roles } from "./users/global"

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

export { loginSchema, type LoginSchemaType } from "./users/auth/login"

// Hunts types

export {
  huntSchema,
  type HuntSchema,
  combinedHuntSchema,
  type CombinedHuntSchema,
} from "./hunts"

export { calculateHuntRange } from "./hunts/utils/calculateHuntRange"

// Chests types
export { chestSchema, type ChestSchema } from "./hunts/chests"
