import { IsNumber, IsString, IsUUID, isUUID } from 'class-validator';

export class UserDto {
    @IsUUID()
    id : string;

    @IsString()
    publicAddress : string;
    
    @IsString()
    username : string;

    @IsNumber()
    nonce : number;
}
