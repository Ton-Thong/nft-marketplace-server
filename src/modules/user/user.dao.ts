import { Inject, Injectable, Scope } from '@nestjs/common';
import { MessageLayerDtoT } from 'src/dto/messageLayer.dto';
import { AddUserDto } from './dto/add-user.dto';
import { v4 as uuid } from 'uuid';
import { UserDto } from './dto/user.dto';
import { DaoInterface } from 'src/helper/dao-interface';
import { IUserDao } from './interface/user.dao.interface';
import { User } from 'src/models/user.model';
import { TableName } from 'src/helper/table-name';
import * as AWS from 'aws-sdk';

@Injectable({ scope: Scope.REQUEST })
class UserDao implements IUserDao {
  constructor(@Inject('DynamoDb') private docClient: AWS.DynamoDB.DocumentClient) { }

  public async createUser(u: AddUserDto): Promise<MessageLayerDtoT<User>> {
    const { publicAddress, username } = u;
    const nonce: number = Math.floor(Math.random() * 10000);
    const newUser = new User({
      id: uuid(),
      publicAddress,
      username,
      nonce,
    });

    await this.docClient
      .put({ TableName: TableName.User, Item: newUser })
      .promise();

    return { ok: true, data: newUser, message: 'success' };
  }

  public async getByKey(id: string): Promise<MessageLayerDtoT<User>> {
    const result = await this.docClient.get({ TableName: TableName.User, Key: { id } }).promise();

    if (Object.keys(result).length == 0) {
      return { ok: false, data: null, message: `User with id ${id} is not found in database` };
    }

    return { ok: true, data: new User(result.Item), message: `success` };
  }

  public async getByPublicAddress(publicAddress: string): Promise<MessageLayerDtoT<User>> {
    const result = await this.docClient
      .scan({
        TableName: TableName.User,
        FilterExpression: '#publicAddress = :publicAddress',
        ExpressionAttributeNames: { '#publicAddress': 'publicAddress' },
        ExpressionAttributeValues: { ':publicAddress': publicAddress },
      })
      .promise();

    if (result.Items.length > 0) {
      return { ok: true, data: new User(result.Items[0]), message: 'success' };
    } else {
      return {
        ok: false, data: null, message: `User with publicAddress ${publicAddress} is not found in database`,
      };
    }
  }

  public async updateNonce(u: UserDto) {
    const { id, nonce } = u;

    await this.docClient.update({
      TableName: TableName.User,
      Key: { id },
      UpdateExpression: 'set #nonce = :n',
      ExpressionAttributeNames: { '#nonce': 'nonce' },
      ExpressionAttributeValues: { ':n': nonce },
    })
      .promise();
  }

  public async getUserAll() {
    const result = await this.docClient.scan({ TableName: TableName.User }).promise();

    if (!result || result.Count <= 0) {
      return { ok: false, data: null, message: `error` };
    }
    if (!result || result.Count <= 0) {
      return { ok: false, data: null, message: 'User is not found in database' };
    } else {
      return { ok: true, data: result.Items, message: 'success' };
    }
  }
}

export const UserDaoProvider = {
  provide: DaoInterface.IUserDao,
  useClass: UserDao,
};
