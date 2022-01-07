import { IsString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    publicAddress: string;

    @IsString()
    username: string;

    @IsString()
    avatar: string;

    @IsString()
    description: string;
}
