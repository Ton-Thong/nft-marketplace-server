import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseDto } from 'src/dto/response.dto';
import { UserDto } from './dto/user.dto';
import { AddUserDto } from 'src/modules/user/dto/add-user.dto';

@Controller('users')
@UsePipes(ValidationPipe)
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    async addUser(@Body() user: AddUserDto): Promise<ResponseDto> {
        try {
            const result: UserDto = await this.userService.create(user);
            return { statusCode: HttpStatus.CREATED, data: result, message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    @Get()
    async get(@Query('publicAddress') publicAddress: string): Promise<ResponseDto> {
        try {
            const result: UserDto = await this.userService.findByPublicAddress(publicAddress);
            return { statusCode: HttpStatus.OK, data: result, message: 'success' };
        } catch (err) {
            throw err;
        }
    }
}