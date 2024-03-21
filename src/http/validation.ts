import { z } from 'zod';

const URL_SCHEMA = z.string().url();
const TOKEN_SCHEMA = z.string().length(6);

export const urlValidation = async (url: string | null): Promise<boolean> => {
	const validatedUrl = await URL_SCHEMA.safeParseAsync(url);

	return validatedUrl.success;
};

export const tokenValidation = async (token: string): Promise<boolean> => (await TOKEN_SCHEMA.safeParseAsync(token)).success;
