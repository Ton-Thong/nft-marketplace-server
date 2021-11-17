;import { IsString } from 'class-validator';

export class CredentialDto {
    @IsString()
    signature : string;
    
    @IsString()
    publicAddress : string;
}