import { Injectable, Scope } from "@nestjs/common";
import * as dynamoose from "dynamoose";
import {Document} from "dynamoose/dist/Document";

export class User extends Document {
    public id: string;
    public publicAddress: string;
    public nonce: number;
    public username: string;
    public avatar: string;
}

@Injectable({ scope: Scope.REQUEST })
export class UserModel {
    public client = dynamoose.model<User>("Users", { 
        "id": {
            "type": String,
            "hashKey": true,
        },
        "publicAddress": {
            "type": String,
            "rangeKey": true
        },
        "nonce": Number,
        "username": String,
        "avatar": String,
    })
}