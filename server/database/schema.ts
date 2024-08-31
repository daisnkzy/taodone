import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	avatar: text('avatar').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
export const todos = sqliteTable('todos', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	completed: integer('completed').default(0).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
