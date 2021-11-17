export const config = {
	algorithms: ['HS256' as const],
	secret: 'jwt-kub',
    region: 'ap-southeast-1',
	endpoint: 'http://localhost:4566',
	expire: 3600,
};