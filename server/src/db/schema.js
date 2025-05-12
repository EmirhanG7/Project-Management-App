import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  verificationToken: varchar('verification_token', { length: 64 }),
  tokenExpiresAt: timestamp('token_expires_at'),
})

export const boards = pgTable('boards', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'CASCADE' }),
})

export const columns = pgTable('columns', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  order: integer('order').default(0),
  boardId: integer('board_id')
    .notNull()
    .references(() => boards.id, { onDelete: 'CASCADE' }),
})

export const cards = pgTable('cards', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  order: integer('order').default(0),
  columnId: integer('column_id')
    .notNull()
    .references(() => columns.id, { onDelete: 'CASCADE' }),
})


export const boardMembers = pgTable(
  'board_members',
  {
    id: serial('id').primaryKey(),
    boardId: integer('board_id')
      .notNull()
      .references(() => boards.id, { onDelete: 'CASCADE' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'CASCADE' }),
    role: varchar('role', { length: 20 }).notNull().default('member'),
  },
  table => ({
    uniqueBoardUser: uniqueIndex(table.boardId, table.userId),
  })
)


export const boardInvitations = pgTable('board_invitations', {
  id: serial('id').primaryKey(),
  boardId: integer('board_id')
    .notNull()
    .references(() => boards.id, { onDelete: 'CASCADE' }),
  email: varchar('email', { length: 256 }).notNull(),
  token: varchar('token', { length: 64 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  accepted: boolean('accepted').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
