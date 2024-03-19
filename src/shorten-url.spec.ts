import { shortenUrl } from "./shorten-url";

describe('shortenUrl', () => {
    it('should return a string', async () => {
        const result = await shortenUrl('https://example.com');
        expect(typeof result).toBe('string');
    });

    it('should return a string of length 6', async () => {
        const result = await shortenUrl('https://example.com');
        expect(result.length).toBe(6);
    });

    it('should return different results for different inputs', async () => {
        const result1 = await shortenUrl('https://example.com');
        const result2 = await shortenUrl('https://different.com');
        expect(result1).not.toBe(result2);
    });
});