import { shortenUrl } from '../../shorten-url';
import { urls } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from '../responses';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import validation from '../validation';

export default async (method: string, pathname: string, searchParams: URLSearchParams, db: DrizzleD1Database) => {
	const url = searchParams.get('url')!;
	const isValid = await validation(url);
	if (!isValid) {
		return BAD_REQUEST('Invalid URL');
	}

	switch (pathname) {
		case '/api/redirect': {
			if (method !== 'GET') {
				return NOT_FOUND();
			}

			const [record] = await db.select().from(urls).where(eq(urls.short, url));

			if (!record) {
				return NOT_FOUND();
			}

			return Response.redirect(record.long, 301);
		}
		case '/api/shorten': {
			if (method !== 'POST') {
				return NOT_FOUND();
			}

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
		}
		default:
			return NOT_FOUND();
	}
};
