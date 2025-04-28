CREATE TABLE "cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"order" integer DEFAULT 0,
	"column_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "boards" DROP CONSTRAINT "boards_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "columns" DROP CONSTRAINT "columns_board_id_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "columns" ALTER COLUMN "order" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_column_id_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."columns"("id") ON DELETE CASCADE ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "columns" ADD CONSTRAINT "columns_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE ON UPDATE no action;