CREATE TABLE "chest_openings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"chestId" uuid NOT NULL,
	"huntId" uuid NOT NULL,
	"obtained_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"artifactId" uuid NOT NULL,
	"obtainedFromChestId" uuid,
	"obtained_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chest_openings" ADD CONSTRAINT "chest_openings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chest_openings" ADD CONSTRAINT "chest_openings_chestId_chests_id_fk" FOREIGN KEY ("chestId") REFERENCES "public"."chests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chest_openings" ADD CONSTRAINT "chest_openings_huntId_hunts_id_fk" FOREIGN KEY ("huntId") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_artifacts" ADD CONSTRAINT "user_artifacts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_artifacts" ADD CONSTRAINT "user_artifacts_artifactId_artifacts_id_fk" FOREIGN KEY ("artifactId") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_artifacts" ADD CONSTRAINT "user_artifacts_obtainedFromChestId_chests_id_fk" FOREIGN KEY ("obtainedFromChestId") REFERENCES "public"."chests"("id") ON DELETE no action ON UPDATE no action;