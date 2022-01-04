import { Inject, Injectable, Scope } from "@nestjs/common";
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { DaoInterface } from "src/helper/dao-interface";
import * as AWS from 'aws-sdk';
import { UserDto } from "../user/dto/user.dto";
import { AddNFTDto } from "./dto/add-nft.dto";
import { INFTDao } from "./interface/nft.dao.interface";
import { v4 as uuid } from 'uuid';
import { TableName } from "src/helper/table-name";
import { NFTDto } from "./dto/nft.dto";

@Injectable({ scope: Scope.REQUEST })
class NFTDao implements INFTDao {
    constructor(@Inject('DynamoDb') private docClient: AWS.DynamoDB.DocumentClient) { }

    public async createNFT(p: AddNFTDto, u: UserDto, nftTxHash: string, tokenId: number): Promise<MessageLayerDtoT<string>> {
        const id = uuid();
        const newNFT = {
            id,
            ...p,
            nftTxHash: nftTxHash,
            createdBy: u.id,
            owner: u.id,
            tokenId: tokenId,
            createdDate: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
            currentPrice: 0,
            lastPrice: 0,
            sellStatus: false,
        }

        await this.docClient.put({
            TableName: TableName.Product,
            Item: newNFT,
        }).promise();

        return { ok: true, data: id, message: 'success' };
    }

    public async getNFTById(id: string): Promise<MessageLayerDtoT<NFTDto>> {
        const result = await this.docClient.get({
            TableName: TableName.Product,
            Key: { id }
        }).promise()

        if (Object.keys(result).length == 0) {
            return { ok: false, data: null, message: `NFT key is not found in database` }
        }

        const nft = new NFTDto();
        nft.mapper(result.Item);

        return { ok: true, data: nft, message: `success` };
    }

    public async getNFTAll(): Promise<MessageLayerDtoT<Array<NFTDto>>> {
        const result = await this.docClient.scan({ TableName: TableName.Product }).promise();
        if (!result || result.Count <= 0) {
            return { ok: false, data: null, message: `error` };
        }

        if (!result || result.Count <= 0) {
            return { ok: false, data: null, message: 'NFT is not found in database' }
        } else {
            const nftDtos: Array<NFTDto> = result.Items.map(e => {
                const nft = new NFTDto();
                nft.mapper(e);
                return nft;
            });

            return { ok: true, data: nftDtos, message: 'success' }
        }
    }

    public async updateSellStatus(u: UserDto): Promise<void> {
        const { id, publicAddress } = u;
        await this.docClient.update({
            TableName: TableName.User,
            Key: { id, publicAddress },
            UpdateExpression: "set #sellStatus = :s",
            ExpressionAttributeNames: { '#sellStatus': 'sellStatus' },
            ExpressionAttributeValues: { ":s": true }
        });
    }
}

export const NFTDaoProvider = {
    provide: DaoInterface.INFTDao,
    useClass: NFTDao
}