import { GUID } from "aws-sdk/clients/es";

export class User {
    id: string;
    nonce : number;
    publicAddress : string;
    username : string;
    avatar : string;
    createDate: Date;
}
