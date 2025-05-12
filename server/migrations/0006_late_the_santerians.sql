ALTER TABLE "board_members" DROP CONSTRAINT "board_members_board_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "board_members" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;