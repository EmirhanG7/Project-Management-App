CREATE TABLE "board_invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_id" integer NOT NULL,
	"email" varchar(256) NOT NULL,
	"token" varchar(64) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "board_invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "board_members" (
	"board_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" varchar(20) DEFAULT 'member' NOT NULL,
	CONSTRAINT "board_members_board_id_user_id_pk" PRIMARY KEY("board_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "board_invitations" ADD CONSTRAINT "board_invitations_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_members" ADD CONSTRAINT "board_members_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_members" ADD CONSTRAINT "board_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE no action;