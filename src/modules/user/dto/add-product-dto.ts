import { IsString } from 'class-validator';

export class AddProductDto {
    @IsString()
    publicAddress : string;
    @IsString()
    username : string;
}
