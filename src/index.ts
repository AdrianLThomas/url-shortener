import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import { urls } from './db/schema';
import { z } from 'zod';

export interface Env {
	DB: D1Database;
}

const URL_SCHEMA = z.string().url();

const shortenUrl = async (url: string, db: DrizzleD1Database) => {
	const longUrl = new URL(url).toString();
	const hashBuffer = await crypto.subtle.digest('MD5', new TextEncoder().encode(longUrl));
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	const b64 = btoa(hashHex);
	const shortUrl = b64.slice(0, 6);

	await db
		.insert(urls)
		.values({
			long: longUrl.toString(),
			short: shortUrl,
		})
		.run();

	return shortUrl;
};

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
				const shortUrl = await shortenUrl(validatedUrl.data, db);
				return Response.json({ shortUrl });
			} catch (e) {
				return new Response('Server error', { status: 500 });
			}
		}

		return new Response('Not found', { status: 404 });
	},
};
