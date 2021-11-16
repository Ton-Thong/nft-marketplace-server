import { Inject, Injectable } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import { MessageLayerDto } from "src/dto/message-layer-dto";
import { User } from '../../models/user.model';
import * as AWS from 'aws-sdk';
import { AddProductDto } from "./dto/add-product-dto";

@Injectable()
export class UserRepository {
    constructor(@Inject('DynamoDb') private docClient: AWS.DynamoDB.DocumentClient) { }

    async create(user: AddProductDto): Promise<any> {
        try {
            const { publicAddress, username } = user;
            const nonce: number = Math.floor(Math.random() * 10000);
            const newUser = { id: uuid(), publicAddress, username, nonce  }

            await this.docClient.put({
                TableName: "Users",
                Item: newUser
            }).promise();

            return new MessageLayerDto(true, newUser, 'success',);
        }
        catch (err) {
            return new MessageLayerDto(false, null, err.message);
        }
    }
}