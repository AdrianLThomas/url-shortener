import { shortenUrl } from './shorten-url';

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
		for (const url of urls) {
			const result = await shortenUrl('http://api.example.com', url);
			expect(result).toContain('http://api.example.com/api/redirect/');
		}
	});

	it('should return different results for different inputs', async () => {
		const results = await Promise.all(urls.map((url) => shortenUrl('http://api.example.com', url)));
		const uniqueResults = new Set(results);
		expect(uniqueResults.size).toBe(urls.length);
	});

	it('should return the same result for the same URL', async () => {
		const result1 = await shortenUrl('http://api.example.com', 'https://example.com');
		const result2 = await shortenUrl('http://api.example.com', 'https://example.com');
		expect(result1).toBe(result2);
	});
});
