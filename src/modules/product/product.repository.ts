import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { MessageLayerDto } from "src/dto/messageLayer.dto";
import { AddProductDto } from "src/dto/product/add-product.dto";
import { UserDto } from "src/dto/user/user.dto";
import { TableName } from "src/helper/Option";
import { Product } from "src/models/product.model";

@Injectable()
export class ProductRepository {
    constructor(@Inject('DynamoDb') private docClient: AWS.DynamoDB.DocumentClient) { }

    async create(p: AddProductDto, u: UserDto): Promise<MessageLayerDto> {
        try {
            const id = uuid();
            const product = new Product();
            product.id = id;
            product.name = p.name;
            product.description = p.description;
            product.imageName = p.imageName;
            product.createdBy = u.id;
            product.owner = u.id;

            await this.docClient.put({
                TableName: TableName.Product,
                Item: product,
            }).promise();

            return { ok: true, data: id, message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    async get(id: string): Promise<MessageLayerDto> {
        try {
            const result = await this.docClient.get({
                TableName: TableName.Product,
                Key: { id }
            }).promise()

            if (Object.keys(result).length == 0) {
                return { ok: false, data: null, message: `Product with id ${id} is not found in database` }
            }

            return { ok: true, data: result.Item, message: `success` };
        } catch(err) {
            throw err;
        }
    }

    async getAll(): Promise<MessageLayerDto> {
        try {
            const result = await this.docClient.scan({ TableName: TableName.Product }).promise();
            if(!result ||  result.Count <= 0) {
                return { ok: false, data: null, message: `error` };    
            }

            return { ok: true, data: result.Items, message: `success` };
        } catch(err) {
            throw err;
        }
    }
}