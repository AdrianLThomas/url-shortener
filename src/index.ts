import { drizzle } from 'drizzle-orm/d1';
import { z } from 'zod';
import { shortenUrl } from './shorten-url';
import { urls } from './db/schema';
import { eq } from 'drizzle-orm';

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
			return new Response('Invalid url', { status: 400 });
		}

		// TODO refactor routing
		if (method === 'GET' && pathname === '/api/redirect') {
			const [record] = await db.select().from(urls).where(eq(urls.short, validatedUrl.data))
			
			if (!record) {
				return new Response('Not found', { status: 404 }); // TODO refactor for consistent responses
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
				return new Response('Server error', { status: 500 });
			}
		}

		return new Response('Not found', { status: 404 });
	},
};
