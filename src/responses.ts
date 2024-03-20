export const NOT_FOUND = () => new Response('Not found', { status: 404 });
export const SERVER_ERROR = () => new Response('Server error', { status: 500 });
export const BAD_REQUEST = (message: string = 'Bad request') => new Response(message, { status: 400 });