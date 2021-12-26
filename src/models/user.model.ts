import { Injectable, Scope } from "@nestjs/common";
import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";
import { TableName } from "src/helper/table-name";

export class User extends Document {
    public id: string;
    public publicAddress: string;
    public nonce: number;
    public username: string;
    public avatar: string;
}

export const UserModel = dynamoose.model<User>(TableName.User, {
    "id": {
        "type": String,
        "hashKey": true,
    },
    "publicAddress": String,
    "nonce": Number,
    "username": String,
    "avatar": String,
});