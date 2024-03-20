import { drizzle } from 'drizzle-orm/d1';
import { z } from 'zod';
import { shortenUrl } from './shorten-url';
import { urls } from './db/schema';
import { eq } from 'drizzle-orm';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from './responses';

export interface Env {
	DB: D1Database;
}

const URL_SCHEMA = z.string().url();

export default {
	async fetch(request: Request, env: Env) {
		const { pathname, searchParams } = new URL(request.url);
		const db = drizzle(env.DB);
		const method = request.method;

		const validatedUrl = await URL_SCHEMA.safeParseAsync(searchParams.get('url'));

		const isValidUrl = validatedUrl.success;
		if (!isValidUrl) {
			return BAD_REQUEST('Invalid URL');
		}

		// TODO refactor routing
		if (method === 'GET' && pathname === '/api/redirect') {
			const [record] = await db.select().from(urls).where(eq(urls.short, validatedUrl.data))
			
			if (!record) {
				return NOT_FOUND();
			}

			return Response.redirect(record.long, 301);
		}
		else if (method === 'POST' && pathname === '/api/shorten') {
			try {
				const longUrl = new URL(validatedUrl.data).toString();
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
	},
};
