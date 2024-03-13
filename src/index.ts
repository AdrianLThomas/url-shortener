import { drizzle } from 'drizzle-orm/d1';
import { urls } from './schema';
export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname, searchParams } = new URL(request.url);
		const db = drizzle(env.DB);
		const longUrl = searchParams.get('url')!;
		const method = request.method

		if (
			//method === 'POST' && 
			pathname === "/api/shorten") {
			// hash it
			const hashBuffer = await crypto.subtle.digest('MD5', new TextEncoder().encode(longUrl))
			const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
			const hashHex = hashArray
				.map((b) => b.toString(16).padStart(2, "0"))
				.join(""); // convert bytes to hex string

			// to base 64
			const b64 = btoa(hashHex)

			// chop it up
			const shortUrl = b64.slice(0, 6)

			await db.insert(urls).values({
				long: longUrl,
				short: shortUrl
			}).run();

			return Response.json({ message: shortUrl });
		}

		return new Response(
			"Not found", { status: 404 }
		);
	},
};