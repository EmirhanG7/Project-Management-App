ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_token" varchar(64);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "token_expires_at" timestamp;