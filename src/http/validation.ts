import { z } from 'zod';

const URL_SCHEMA = z.string().url();

export default async (url: string | null): Promise<boolean> => {
	const validatedUrl = await URL_SCHEMA.safeParseAsync(url);

	return validatedUrl.success;
};
