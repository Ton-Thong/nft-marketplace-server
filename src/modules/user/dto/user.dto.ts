import { IsNumber, IsString, IsUUID, isUUID } from 'class-validator';
import { User } from 'src/models/user.model';

export class UserDto {
    constructor(u: User) {
        const { id, publicAddress, username, nonce } = u;
        this.id = id;
        this.publicAddress = publicAddress;
        this.username = username;
        this.nonce = nonce;
    }

    @IsUUID()
    id: string;

    @IsString()
    publicAddress: string;

    @IsString()
    username: string;

    @IsNumber()
    nonce: number;
}
