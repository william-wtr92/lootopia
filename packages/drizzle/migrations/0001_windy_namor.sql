CREATE TABLE "crown_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"crowns" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"discount" integer,
	"bonus" integer,
	"popular" boolean DEFAULT false
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
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_crownPackageId_crown_packages_id_fk" FOREIGN KEY ("crownPackageId") REFERENCES "public"."crown_packages"("id") ON DELETE no action ON UPDATE no action;