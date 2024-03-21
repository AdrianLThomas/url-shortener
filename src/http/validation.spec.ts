import { urlValidation, tokenValidation } from './validation';

describe('validation', () => {
    describe('urlValidation', () => {
        it('should return true when url valid', async () => {
            const result = await urlValidation('http://valid.url');
            expect(result).toBe(true);
        });
    
        it('should return false when url invalid', async () => {
            const result = await urlValidation('invalid.url');
            expect(result).toBe(false);
        });
    
        it('should return false when url is null', async () => {
            const result = await urlValidation(null);
            expect(result).toBe(false);
        });

    })

    describe('tokenValidation', () => {
        it('should return true when token valid', async () => {
            const result = await tokenValidation('abcdef');
            expect(result).toBe(true);
        });
    
        it('should return false when token too short', async () => {
            const result = await tokenValidation('a');
            expect(result).toBe(false);
        });

        it('should return false when token too long', async () => {
            const result = await tokenValidation('123456789');
            expect(result).toBe(false);
        });
    });
});
