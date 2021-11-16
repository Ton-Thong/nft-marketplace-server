import { IsString } from 'class-validator';

export class CreateTokenDto {
    @IsString()
    signature : string;
    @IsString()
    publicAddress : string;
}