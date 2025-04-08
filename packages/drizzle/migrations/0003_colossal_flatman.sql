ALTER TABLE "crown_packages" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "crown_packages" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;