import { generateToken } from './generate-token';

describe('shortenUrl', () => {
	const urls = [
		'https://example.com',
		'https://different.com',
		'https://EXAMPLE.com',
		'https://example.com?param=value',
		'https://example.com#fragment',
		'https://example.com/path/to/resource',
	];

	it('should always return a string of length 6', async () => {
		const prefix = 'http://api.example.com';
		for (const url of urls) {
			const result = await generateToken(url);
			expect(result).toHaveLength(6);
		}
	});

	it('should return different results for different inputs', async () => {
		const results = await Promise.all(urls.map((url) => generateToken(url)));
		const uniqueResults = new Set(results);
		expect(uniqueResults.size).toBe(urls.length);
	});

	it('should return the same result for the same URL', async () => {
		const result1 = await generateToken('https://example.com');
		const result2 = await generateToken('https://example.com');
		expect(result1).toBe(result2);
	});
});
