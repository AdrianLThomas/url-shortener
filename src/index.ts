import { drizzle } from 'drizzle-orm/d1';
import routes from './http/routes';
import validation from './http/validation';

export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname, searchParams } = new URL(request.url);
		const db = drizzle(env.DB);
		const method = request.method;

		const validatedUrl = await validation(searchParams.get('url')!); // TODO remove !
		if (validatedUrl instanceof Response) {
			// TODO - refactor, awkward
			return validatedUrl;
		}

		return await routes(method, pathname, validatedUrl, db);
	},
};
