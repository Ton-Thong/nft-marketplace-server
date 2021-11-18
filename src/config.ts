// export const config = {
// 	algorithms: ['HS256' as const],
// 	secret: 'jwt-kub',
//     region: 'ap-southeast-1',
// 	endpoint: 'http://localhost:4566',
// 	expire: 3600,
// };


export const config = {
	algorithms: ['HS256' as const],
	secret: 'jwt-kub',
	region: 'ap-southeast-1',
	endpoint: 'http://dynamodb.ap-southeast-1.amazonaws.com',
	expire: 3600,
	accessKeyId: 'AKIAZD6OMECZXBBDIM3I',
	secretAccessKey: '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',
	bucketname: 'nft-asset-toodation',
};