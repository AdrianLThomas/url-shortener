import { shortenUrl } from '../../shorten-url';
import { urls } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { NOT_FOUND, SERVER_ERROR } from '../responses';
import { DrizzleD1Database } from 'drizzle-orm/d1';

export default async (method: string, pathname: string, url: string, db: DrizzleD1Database) => {
	// TODO refactor routing - switch case
	if (method === 'GET' && pathname === '/api/redirect') {
		const [record] = await db.select().from(urls).where(eq(urls.short, url));

		if (!record) {
			return NOT_FOUND();
		}

		return Response.redirect(record.long, 301);
	} else if (method === 'POST' && pathname === '/api/shorten') {
		try {
			const longUrl = new URL(url).toString();
			const shortUrl = await shortenUrl(longUrl);

			await db
				.insert(urls)
				.values({
					long: longUrl,
					short: shortUrl,
				})
				.onConflictDoNothing()
				.run();

			return Response.json({ shortUrl });
		} catch (e) {
			return SERVER_ERROR();
		}
	}

	return NOT_FOUND();
};
