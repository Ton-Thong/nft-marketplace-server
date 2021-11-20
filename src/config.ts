export const config = {
	algorithms: ['HS256' as const],
	secret: 'jwt-kub',
	region: 'ap-southeast-1',
	endpoint: 'http://dynamodb.ap-southeast-1.amazonaws.com',
	expire: 3600,

	//Dynamo
	accessKeyId: 'AKIAZD6OMECZXBBDIM3I',
	secretAccessKey: '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',
	
	//S3 
	bucketname: 'nft-market-object',
	accessKeyId_space: 'ZIYSV4K25ECCHN3OHHRC',
	secretAccessKey_space: 'dd3IPK9xmBb2Tt4ilJetZMv5E/z16eRBWBrY4m1XyxI',
	endpoint_space: 'sgp1.digitaloceanspaces.com',
};