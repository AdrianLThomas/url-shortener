import { drizzle } from 'drizzle-orm/d1';
import { urls } from './schema';
export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname, searchParams } = new URL(request.url);
		const db = drizzle(env.DB);
		const method = request.method;

		if (method === 'POST' && pathname === '/api/shorten') {
			const urlParam = searchParams.get('url');

			if (!urlParam) {
				return new Response('Invalid url', { status: 400 });
			}
			let longUrl = '';

			// convert to a string - TODO introduce Joi or Zod for validation
			try {
				longUrl = new URL(urlParam).toString();
			} catch (e) {
				return new Response('Invalid url', { status: 400 });
			}

			// hash it
			const hashBuffer = await crypto.subtle.digest('MD5', new TextEncoder().encode(longUrl));
			const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
			const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string

			// to base 64
			const b64 = btoa(hashHex);

			// chop it up
			const shortUrl = b64.slice(0, 6);

			await db
				.insert(urls)
				.values({
					long: longUrl.toString(),
					short: shortUrl,
				})
				.run();

			return Response.json({ shortUrl });
		}

		return new Response('Not found', { status: 404 });
	},
};
