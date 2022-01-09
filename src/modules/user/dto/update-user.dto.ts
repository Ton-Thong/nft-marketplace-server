import { IsString } from 'class-validator';

export class UpdateUserDto {
    avatar: string;
    username: string;
    description: string;
}