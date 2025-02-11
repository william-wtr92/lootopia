export * from "./global/status"
export * from "./global/server"

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

export { huntSchema, type HuntSchema } from "./hunts"

// Chests types
export {
  chestSchema,
  type ChestSchema,
  positionSchema,
  type PositionSchema,
  type PositionCords,
  parsePosition,
} from "./hunts/chests"
