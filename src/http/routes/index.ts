import { generateToken } from '../../generate-token';
import { urls } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from '../responses';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { tokenValidation, urlValidation } from '../validation';

export default async (request: Request, db: DrizzleD1Database) => {
	const { pathname, searchParams } = new URL(request.url);
	console.log({ request });

	switch (pathname) {
		case '/api/redirect': {
			if (request.method !== 'GET') {
				return NOT_FOUND();
			}

			const token = searchParams.get('token')!;
			const isValid = await tokenValidation(token); // todo support token validation
			if (!isValid) {
				return BAD_REQUEST('Invalid URL');
			}

			const [record] = await db.select().from(urls).where(eq(urls.short, token));

			if (!record) {
				return NOT_FOUND();
			}

			return Response.redirect(record.long, 301);
		}
		case '/api/shorten': {
			if (request.method !== 'POST') {
				return NOT_FOUND();
			}

			const url = searchParams.get('url')!;
			const isValid = await urlValidation(url);
			if (!isValid) {
				return BAD_REQUEST('Invalid URL');
			}

			const longUrl = new URL(url).toString();
			const shortUrlToken = await generateToken(longUrl);

			await db
				.insert(urls)
				.values({
					long: longUrl,
					short: shortUrlToken,
				})
				.onConflictDoNothing()
				.run();

			return Response.json({ shortUrl: `${request.headers.get('host')}/api/redirect?token=${shortUrlToken}` });
		}
		default:
			return NOT_FOUND();
	}
};
