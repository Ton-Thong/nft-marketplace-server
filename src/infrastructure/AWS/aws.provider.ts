import * as AWS from 'aws-sdk';
import { config } from 'src/config';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { TableName } from 'src/helper/Option';
import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

export const AWSProviders = [
  {
    provide: 'DynamoDb',
    useFactory: async () => {
      try {
        const serviceConfigOptions: ServiceConfigurationOptions = {
          region: process.env.REGION || config.region,
          endpoint: process.env.DYNAMOENDPOINT || config.endpoint,
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        };

        const docClient = new AWS.DynamoDB.DocumentClient(serviceConfigOptions);
        const dynamoDb = new AWS.DynamoDB(serviceConfigOptions);

        const listTable = await dynamoDb.listTables().promise();
        if (!listTable.TableNames.includes('Users')) {
          const params : CreateTableInput = {
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
          };

          await dynamoDb.createTable(params).promise();
        }

        return docClient;
      } catch (err) {
        throw err;
      }
    },
  },
  {
    provide: 'S3',
    useFactory: async() => {
      try {
        return new AWS.S3({
          region: config.region,
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        })
      } catch(err) {
        throw err;
      }
    }
  }
];
