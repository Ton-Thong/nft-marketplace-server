export class DynamoExpression {
    UpdateExpression: string;
    ExpressionAttributeNames: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap;
    ExpressionAttributeValues: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap;
}