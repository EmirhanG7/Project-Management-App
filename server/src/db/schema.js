import {integer, pgTable, serial, text, varchar,} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
});


export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  userId: integer("user_id").notNull(),
});

export const columns = pgTable("columns", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  order: integer("order").default(0),
  boardId: integer("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "CASCADE" }),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  order: integer("order").default(0),
  columnId: integer("column_id")
    .notNull()
    .references(() => columns.id, { onDelete: "CASCADE" }),
});
