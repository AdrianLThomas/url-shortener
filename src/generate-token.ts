export const generateToken = async (longUrl: string) => {
	const hashBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(longUrl));
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	const b64 = btoa(hashHex);
	const shortUrlToken = b64.slice(0, 6);

	return shortUrlToken;
};
