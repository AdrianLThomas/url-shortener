import { unstable_dev } from 'wrangler';
import { UnstableDevWorker } from 'wrangler';

describe('Worker', () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev('src/index.ts', {
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it('should return a shortened url', async () => {
		const resp = await worker.fetch('/api/shorten?url=https://example.com', {
			method: 'POST',
		});
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
		const resp = await worker.fetch('/api/shorten?url=', {
			method: 'POST',
		});

		expect(resp.status).toBe(400);
	});
	
	it('should return 400 for invalid url', async () => {
		const resp = await worker.fetch('/api/shorten?url=woop', {
			method: 'POST',
		});

		expect(resp.status).toBe(400);
	});

	// should return the same url if it is already shortened (x2 times)
	// should return a shortened url for a very long url
	// should return a shortened url for a url with special characters
	// should return 400 if attempting to shorten an already shortened url
});
