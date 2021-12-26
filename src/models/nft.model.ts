import * as dynamoose from "dynamoose";
import {Document} from "dynamoose/dist/Document";
import { Injectable, Scope } from "@nestjs/common";
import { TableName } from "src/helper/table-name";

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
    public cid: string;
    public metadata:string;
    public nftTxHash: string;
    public tokenId: number;
}

export const NFTModel = dynamoose.model<NFT>(TableName.Product, {
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
    "sellStatus": {
        "type": Boolean,
        "default": false
    },
    "lastPrice": {
        "type": Number,
        "default": 0,
    },
    "currentPrice": {
        "type": Number,
        "default": 0,
    },
    "owner": String,
    "createdBy": String,
    "createdDate": {
        "type": String,
        "default": new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    },
    "cid": String,
    "metadata": String,
    "nftTxHash": String,
    "tokenId": Number,
})