import { unstable_dev } from 'wrangler';
import { UnstableDevWorker } from 'wrangler';

describe('Worker', () => {
	let worker: UnstableDevWorker;

	const shortenUrl = async (url: string = 'https://example.com') =>
		await worker.fetch(`/api/shorten?url=${url}`, {
			method: 'POST',
		});

	beforeAll(async () => {
		worker = await unstable_dev('src/index.ts', {
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it('should return a shortened url', async () => {
		const resp = await shortenUrl();
		const text = await resp.json();

		expect(text).toEqual({
			shortUrl: 'MTgyY2',
		});
		expect(resp.status).toBe(200);
	});

	it('should return 400 for missing url', async () => {
		const resp = await worker.fetch('/api/shorten', {
			method: 'POST',
		});

		expect(resp.status).toBe(400);
	});

	it('should return 400 for null url', async () => {
		const resp = await shortenUrl('');

		expect(resp.status).toBe(400);
	});

	it('should return 400 for invalid url', async () => {
		const resp = await shortenUrl('woop');
		expect(resp.status).toBe(400);
	});

	it('should return the same url if it is already shortened (x2 times)', async () => {
		const [first, second] = await Promise.all([shortenUrl(), shortenUrl()]);

		expect(first.json()).toEqual(second.json());
	});

	it('should return a shortened url for a very long url', async () => {
		const resp = await shortenUrl(
			'https://example-example-example-example-example-example-example-example-example-example-example-example-example-example.com?somequerystring=onetwothree&another=fourfivesixseveneight',
		);
		const text = await resp.json();

		expect(text).toEqual({
			shortUrl: 'NjEyZT',
		});
		expect(resp.status).toBe(200);
	});
});
