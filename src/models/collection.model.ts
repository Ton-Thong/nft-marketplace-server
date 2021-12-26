import { Injectable, Scope } from "@nestjs/common";
import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";
import { TableName } from "src/helper/table-name";

export class Collection extends Document {
    public id: string;
    public name: string;
    public createdBy: string;
}

export const CollectionModel = dynamoose.model<Collection>(TableName.Collection, {
    "id": {
        "type": String,
        "hashKey": true,
    },
    "name": String,
    "createdBy": String,
})