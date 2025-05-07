CREATE TABLE "artifact_offer_favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offerId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"favorited_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artifact_offer_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offerId" uuid NOT NULL,
	"viewerId" uuid NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artifact_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sellerId" uuid NOT NULL,
	"userArtifactId" uuid NOT NULL,
	"price" integer NOT NULL,
	"description" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artifact_ownership_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userArtifactId" uuid NOT NULL,
	"type" text DEFAULT 'discovery' NOT NULL,
	"previousOwnerId" uuid,
	"newOwnerId" uuid,
	"huntId" uuid,
	"offerId" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"link" text NOT NULL,
	"shaKey" text NOT NULL,
	"rarity" text DEFAULT 'common' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chest_openings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"chestId" uuid NOT NULL,
	"huntId" uuid NOT NULL,
	"obtained_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text,
	"position" geometry(point) NOT NULL,
	"rewardType" text NOT NULL,
	"reward" text,
	"size" integer DEFAULT 80 NOT NULL,
	"maxUsers" integer DEFAULT 1 NOT NULL,
	"visibility" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"huntId" uuid NOT NULL,
	"artifactId" uuid
);
--> statement-breakpoint
CREATE TABLE "crown_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"crowns" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"discount" integer,
	"bonus" integer,
	"popular" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "crown_packages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "crowns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hunt_participation_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"huntId" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "hunt_participations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"huntId" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hunts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"city" varchar(255) NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"public" boolean DEFAULT true NOT NULL,
	"maxParticipants" integer DEFAULT 0,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organizerId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"crownPackageId" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"providerPaymentId" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reason" text NOT NULL,
	"description" text NOT NULL,
	"attachment" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"reporterId" uuid NOT NULL,
	"reportedId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"userId" uuid NOT NULL,
	"huntId" uuid,
	"artifactOfferId" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "user_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"experience" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nickname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"password_salt" text NOT NULL,
	"birthdate" timestamp NOT NULL,
	"avatar" text,
	"email_validated" boolean DEFAULT false NOT NULL,
	"gdpr_validated" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"mfa_enabled" boolean DEFAULT false NOT NULL,
	"mfa_secret" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deactivation_date" timestamp,
	"deletion_date" timestamp,
	CONSTRAINT "users_nickname_unique" UNIQUE("nickname"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "artifact_offer_favorites" ADD CONSTRAINT "artifact_offer_favorites_offerId_artifact_offers_id_fk" FOREIGN KEY ("offerId") REFERENCES "public"."artifact_offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_offer_favorites" ADD CONSTRAINT "artifact_offer_favorites_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_offer_views" ADD CONSTRAINT "artifact_offer_views_offerId_artifact_offers_id_fk" FOREIGN KEY ("offerId") REFERENCES "public"."artifact_offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_offer_views" ADD CONSTRAINT "artifact_offer_views_viewerId_users_id_fk" FOREIGN KEY ("viewerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_offers" ADD CONSTRAINT "artifact_offers_sellerId_users_id_fk" FOREIGN KEY ("sellerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_offers" ADD CONSTRAINT "artifact_offers_userArtifactId_user_artifacts_id_fk" FOREIGN KEY ("userArtifactId") REFERENCES "public"."user_artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_ownership_history" ADD CONSTRAINT "artifact_ownership_history_userArtifactId_user_artifacts_id_fk" FOREIGN KEY ("userArtifactId") REFERENCES "public"."user_artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_ownership_history" ADD CONSTRAINT "artifact_ownership_history_previousOwnerId_users_id_fk" FOREIGN KEY ("previousOwnerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_ownership_history" ADD CONSTRAINT "artifact_ownership_history_newOwnerId_users_id_fk" FOREIGN KEY ("newOwnerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_ownership_history" ADD CONSTRAINT "artifact_ownership_history_huntId_hunts_id_fk" FOREIGN KEY ("huntId") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_ownership_history" ADD CONSTRAINT "artifact_ownership_history_offerId_artifact_offers_id_fk" FOREIGN KEY ("offerId") REFERENCES "public"."artifact_offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chest_openings" ADD CONSTRAINT "chest_openings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chest_openings" ADD CONSTRAINT "chest_openings_chestId_chests_id_fk" FOREIGN KEY ("chestId") REFERENCES "public"."chests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chest_openings" ADD CONSTRAINT "chest_openings_huntId_hunts_id_fk" FOREIGN KEY ("huntId") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chests" ADD CONSTRAINT "chests_huntId_hunts_id_fk" FOREIGN KEY ("huntId") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chests" ADD CONSTRAINT "chests_artifactId_artifacts_id_fk" FOREIGN KEY ("artifactId") REFERENCES "public"."artifacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crowns" ADD CONSTRAINT "crowns_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunt_participation_requests" ADD CONSTRAINT "hunt_participation_requests_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunt_participation_requests" ADD CONSTRAINT "hunt_participation_requests_huntId_hunts_id_fk" FOREIGN KEY ("huntId") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunt_participations" ADD CONSTRAINT "hunt_participations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunt_participations" ADD CONSTRAINT "hunt_participations_huntId_hunts_id_fk" FOREIGN KEY ("huntId") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunts" ADD CONSTRAINT "hunts_organizerId_users_id_fk" FOREIGN KEY ("organizerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_crownPackageId_crown_packages_id_fk" FOREIGN KEY ("crownPackageId") REFERENCES "public"."crown_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_users_id_fk" FOREIGN KEY ("reporterId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reportedId_users_id_fk" FOREIGN KEY ("reportedId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_huntId_hunts_id_fk" FOREIGN KEY ("huntId") REFERENCES "public"."hunts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_artifactOfferId_artifact_offers_id_fk" FOREIGN KEY ("artifactOfferId") REFERENCES "public"."artifact_offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_artifacts" ADD CONSTRAINT "user_artifacts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_artifacts" ADD CONSTRAINT "user_artifacts_artifactId_artifacts_id_fk" FOREIGN KEY ("artifactId") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_artifacts" ADD CONSTRAINT "user_artifacts_obtainedFromChestId_chests_id_fk" FOREIGN KEY ("obtainedFromChestId") REFERENCES "public"."chests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_levels" ADD CONSTRAINT "user_levels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_favorite_per_user_offer" ON "artifact_offer_favorites" USING btree ("offerId","userId");--> statement-breakpoint
CREATE UNIQUE INDEX "artifact_offer_views_unique" ON "artifact_offer_views" USING btree ("offerId","viewerId");--> statement-breakpoint
CREATE UNIQUE INDEX "sha_key_idx" ON "artifacts" USING btree ("shaKey");--> statement-breakpoint
CREATE INDEX "chests_position_index" ON "chests" USING gist ("position");--> statement-breakpoint
CREATE UNIQUE INDEX "user_idx" ON "crowns" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_hunt_participation_request" ON "hunt_participation_requests" USING btree ("userId","huntId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_hunt_participation" ON "hunt_participations" USING btree ("userId","huntId");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "phone_idx" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX "nickname_idx" ON "users" USING btree ("nickname");