import * as AWS from 'aws-sdk';
import * as dynamoose from "dynamoose";
import { TableName } from 'src/helper/table-name';

export const AWSProviders = [
  {
    provide: 'DynamoDb',
    useFactory: async () => {
      try {
        const ddb = new dynamoose.aws.sdk.DynamoDB({
          region: process.env.AWS_REGION,
          endpoint: process.env.AWS_ENDPOINT,
          accessKeyId: process.env.AWS_ACCESSKEYID,
          secretAccessKey: process.env.AWS_SECRETACCESSKEY,
        });

        const listTable = await ddb.listTables().promise();
        if (!listTable.TableNames.includes(TableName.User)) {
          await ddb.createTable({
            TableName: TableName.User,
            KeySchema: [
              { AttributeName: 'id', KeyType: 'HASH' },
              { AttributeName: 'publicAddress', KeyType: 'RANGE' },
            ],
            AttributeDefinitions: [
              { AttributeName: 'id', AttributeType: 'S' },
              { AttributeName: 'publicAddress', AttributeType: 'S' },
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          }).promise();
        }

        if (!listTable.TableNames.includes(TableName.Product)) {
          await ddb.createTable({
            TableName: TableName.Product,
            KeySchema: [
              { AttributeName: 'id', KeyType: 'HASH' },
            ],
            AttributeDefinitions: [
              { AttributeName: 'id', AttributeType: 'S' },
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          }).promise();
        }

        if (!listTable.TableNames.includes(TableName.Collection)) {
          await ddb.createTable({
            TableName: TableName.Collection,
            KeySchema: [
              { AttributeName: 'id', KeyType: 'HASH' },
            ],
            AttributeDefinitions: [
              { AttributeName: 'id', AttributeType: 'S' },
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          }).promise();
        }

        if(!listTable.TableNames.includes(TableName.Billing)) {
          await ddb.createTable({
            TableName: TableName.Billing,
            KeySchema: [
              { AttributeName: 'id', KeyType: 'HASH' },
            ],
            AttributeDefinitions: [
              { AttributeName: 'id', AttributeType: 'S' },
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          }).promise();
        }

        dynamoose.aws.ddb.set(ddb);
      } catch (err) {
        throw err;
      }
    },
  },
  {
    provide: 'S3',
    useFactory: async () => {
      try {
        return new AWS.S3({
          endpoint: process.env.S3_ENDPOINT,
          accessKeyId: process.env.S3_ACCESSKEYID,
          secretAccessKey: process.env.S3_SECRETACCESSKEY,
        })
      } catch (err) {
        throw err;
      }
    }
  },
];
