import { Injectable, Scope } from "@nestjs/common";
import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";

export class Collection extends Document {
    public id: string;
    public name: string;
    public createdBy: string;
}

@Injectable({ scope: Scope.REQUEST })
export class CollectionModel {
    public client = dynamoose.model<Collection>("Users", {
        "id": {
            "type": String,
            "hashKey": true,
        },
        "name": String,
        "createdBy": String,
    })
}