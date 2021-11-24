import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class IpfsService {
    private basicAuth: string;

    constructor() {
        this.basicAuth = 'Basic ' + Buffer.from(process.env.IPFS_INFURA_ACCESSKEYID + ':' + process.env.IPFS_INFURA_SECRETACCESSKEY).toString('base64');
    }

    async pinCid(cid: Array<string>): Promise<any> {
        return cid.map(async e =>
            await axios({
                method: 'post',
                url: `${process.env.IPFS_ENDPOINT}/api/v0/pin/add?arg=${e}`,
                headers: { 'Authorization': this.basicAuth }
            }));
    }
}