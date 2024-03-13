import { unstable_dev } from "wrangler";
import { UnstableDevWorker } from "wrangler";

describe("Worker", () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("src/index.ts", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("should return a 404 for an invalid route", async () => {
    const resp = await worker.fetch()
    const text = await resp.text();
    expect(text).toMatchInlineSnapshot(`"Not found"`);
  });
});
