CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
