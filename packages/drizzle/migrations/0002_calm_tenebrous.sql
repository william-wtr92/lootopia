CREATE TABLE "chests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text,
	"position" geometry(point) NOT NULL,
	"reward" text NOT NULL,
	"size" integer DEFAULT 80 NOT NULL,
	"maxUsers" integer DEFAULT 1 NOT NULL,
	"visibility" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"huntId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hunts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"endDate" timestamp NOT NULL,
	"mode" boolean DEFAULT true NOT NULL,
	"maxParticipants" integer DEFAULT 0,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organizerId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chests" ADD CONSTRAINT "chests_huntId_hunts_id_fk" FOREIGN KEY ("huntId") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunts" ADD CONSTRAINT "hunts_organizerId_users_id_fk" FOREIGN KEY ("organizerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chests_position_index" ON "chests" USING gist ("position");