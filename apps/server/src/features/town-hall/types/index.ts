import type { artifactOwnershipHistory } from "@lootopia/drizzle"
import type { InferInsertModel } from "drizzle-orm"

export type InsertArtifactHistory = InferInsertModel<
  typeof artifactOwnershipHistory
>
