import { IsString } from 'class-validator';

export class AddUserDto {
    @IsString()
    publicAddress: string;

    @IsString()
    username: string;
}
