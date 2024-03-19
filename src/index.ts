import { drizzle } from 'drizzle-orm/d1';
import { z } from 'zod';
import { shortenUrl } from './shorten-url';
import { urls } from './db/schema';

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
		if (method === 'POST' && pathname === '/api/shorten') {
			const isValidUrl = validatedUrl.success;
			if (!isValidUrl) {
				return new Response('Invalid url', { status: 400 });
			}

			try {
				const longUrl = new URL(validatedUrl.data).toString();
				const shortUrl = await shortenUrl(longUrl);

				await db
				.insert(urls)
				.values({
					long: longUrl.toString(),
					short: shortUrl,
				})
				.run();
				
				return Response.json({ shortUrl });
			} catch (e) {
				return new Response('Server error', { status: 500 });
			}
		}

		return new Response('Not found', { status: 404 });
	},
};
