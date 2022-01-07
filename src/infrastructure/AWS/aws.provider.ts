import { Scope } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { TableName } from 'src/helper/table-name';

export const AWSProviders = [
  {
    provide: 'DynamoDb',
    scope: Scope.REQUEST,
    useFactory: async () => {
      try {
        const serviceConfigOptions: ServiceConfigurationOptions = {
          region: process.env.AWS_REGION,
          endpoint: process.env.AWS_ENDPOINT,
          accessKeyId: process.env.AWS_ACCESSKEYID,
          secretAccessKey: process.env.AWS_SECRETACCESSKEY,
        };
        console.log('test');
        const docClient = new AWS.DynamoDB.DocumentClient(serviceConfigOptions);
        const dynamoDb = new AWS.DynamoDB(serviceConfigOptions);

        const listTable = await dynamoDb.listTables().promise();
        console.log(listTable);
        if (!listTable.TableNames.includes(TableName.User)) {
          await dynamoDb.createTable({
            TableName: TableName.User,
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
        
        if (!listTable.TableNames.includes(TableName.Product)) {
          await dynamoDb.createTable({
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
          await dynamoDb.createTable({
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

        if (!listTable.TableNames.includes(TableName.Billing)) {
          await dynamoDb.createTable({
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

        return docClient;
      } catch (err) {
        throw err;
      }
    },
  },
  {
    provide: 'S3',
    scope: Scope.REQUEST,
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
