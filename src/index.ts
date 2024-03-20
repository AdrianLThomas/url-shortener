import { drizzle } from 'drizzle-orm/d1';
import routes from './http/routes';

export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname, searchParams } = new URL(request.url);
		const db = drizzle(env.DB);
		const method = request.method;

		return await routes(method, pathname, searchParams, db);
	},
};