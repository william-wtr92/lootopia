import { createHash } from "crypto"

export const generateSHA256 = (buffer: Buffer): string => {
  return createHash("sha256").update(buffer).digest("hex")
}
