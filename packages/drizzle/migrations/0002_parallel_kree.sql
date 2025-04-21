ALTER TABLE "artifact_ownership_history" ALTER COLUMN "previousOwnerId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_ownership_history" ALTER COLUMN "newOwnerId" DROP NOT NULL;