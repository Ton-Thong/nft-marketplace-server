import { Inject, Injectable } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';

@Injectable()
export class FileService {
    constructor(@Inject('S3') private s3: AWS.S3) { }

    public async getSignedUrlPutObject(bucketName: string, objectName: string, objectType: string): Promise<string> {
        return objectName ? await this.s3.getSignedUrlPromise('putObject', {
            Bucket: bucketName,
            Key: `${objectName}`,
            ContentType: objectType,
            Expires: 3600,
        }) : objectName;
    }

    public async getSignedUrlGetObject(bucketName: string, objectName: string): Promise<string> {
        return objectName ? this.s3.getSignedUrlPromise('getObject', {
            Bucket: bucketName,
            Key: `${objectName}`,
            Expires: 18000,
        }) : null;
    }

    public async uploadObjectToS3(bucketName: string, file: Express.Multer.File): Promise<string> {
        const objectName = `${uuid()}-${file.originalname}`;
        await this.s3.putObject({
            Bucket: bucketName,
            Key: objectName,
            Body: file.buffer,
            ContentEncoding: 'base64',
            ContentType: file.mimetype,
            ContentLength: file.size,
        }).promise();

        return objectName;
    }
}