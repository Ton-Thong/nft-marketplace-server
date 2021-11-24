import { Inject, Injectable } from "@nestjs/common";
import * as AWS from 'aws-sdk';

@Injectable()
export class FileService {
    constructor(@Inject('S3') private s3: AWS.S3) { }

    async getSignedUrlPutObject(bucketName: string, objectName: string, objectType: string): Promise<string> {
        try {
            return await this.s3.getSignedUrlPromise('putObject', {
                Bucket: bucketName,
                Key: `${objectName}`,
                ContentType: objectType,
                Expires: 3600,
            });
        } catch(err) {
            throw err;
        }
    }

    async getSignedUrlGetObject(bucketName: string, objectName: string): Promise<string> {
        try {
            return await this.s3.getSignedUrlPromise('getObject', {
                Bucket: bucketName,
                Key: `${objectName}`,
                Expires: 18000,
            });
        } catch(err) {
            throw err;
        }
    }
}