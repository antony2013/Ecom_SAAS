ALTER TABLE "stores" ADD COLUMN "custom_domain" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "custom_domain_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "custom_domain_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_custom_domain_unique" UNIQUE("custom_domain");