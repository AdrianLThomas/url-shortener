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
			shortUrl: 'Yzk4NG'
		})
	});
});
