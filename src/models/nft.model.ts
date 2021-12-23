import * as dynamoose from "dynamoose";
import {Document} from "dynamoose/dist/Document";
import { Injectable, Scope } from "@nestjs/common";

export class NFT extends Document {
    public id: string;
    public name: string;
    public fileName: string;
    public fileType: string;
    public collectionId: string;
    public collectionName: string;
    public description: string;
    public sellStatus: boolean = false;
    public lastPrice: number = 0;
    public currentPrice: number = 0;
    public owner: string;
    public createdBy: string;
    public createdDate: string = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    public contractAddress: string;
    public cid: string;
    public nftTxHash: string;
    public tokenId: string;
}

@Injectable({ scope: Scope.REQUEST })
export class NFTModel {
    public client = dynamoose.model<NFT>("Products", {
        "id": {
            "type": String,
            "hashKey": true,
        },
        "name": String,
        "fileName": String,
        "fileType": String,
        "collectionId": String,
        "collectionName": String,
        "description": String,
        "sellStatus": Boolean,
        "lastPrice": Number,
        "currentPrice": Number,
        "owner": String,
        "createdBy": String,
        "createdDate": String,
        "contractAddress": String,
        "cid": String,
        "nftTxHash": String,
        "tokenId": String,
    })
}