import { drizzle } from 'drizzle-orm/d1';
import routes from './http/routes';

export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		const db = drizzle(env.DB);

		return await routes(request, db);
	},
};