import { users } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import { eq } from "drizzle-orm"

export const updateEmailValidation = async (email: string) => {
  return db
    .update(users)
    .set({
      emailValidated: true,
    })
    .where(eq(users.email, email))
}
