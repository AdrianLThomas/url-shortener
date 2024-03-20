import { z } from 'zod';
import { BAD_REQUEST } from './responses';

const URL_SCHEMA = z.string().url();

export default async (urL: string): Promise<Response | string> => {
	// TODO - bit weird
	const validatedUrl = await URL_SCHEMA.safeParseAsync(urL);

	const isValidUrl = validatedUrl.success;
	if (!isValidUrl) {
		return BAD_REQUEST('Invalid URL');
	}

	return validatedUrl.data;
};
