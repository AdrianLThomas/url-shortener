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
			shortUrl: 'Yzk4NG',
		});
	});

	// should return 400 for missing url
	// should return 400 for invalid url
	// should return the same url if it is already shortened (x2 times)
	// should return a shortened url for a very long url
	// should return a shortened url for a url with special characters
	// should return 400 if attempting to shorten an already shortened url
});
