import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const urls = sqliteTable('urls', {
	id: integer('id').primaryKey(),
	short: text('short').notNull().unique(),
	long: text('long').notNull().unique(),
});
