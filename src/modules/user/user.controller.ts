import { Body, Controller, Get, HttpStatus, Inject, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ResponseDto, ResponseDtoT } from 'src/dto/response.dto';
import { UserDto } from './dto/user.dto';
import { AddUserDto } from 'src/modules/user/dto/add-user.dto';
import { ServiceInterface } from 'src/helper/service-interface';
import { IUserService } from './interface/user.service.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UsePipes(ValidationPipe)
export class UserController {
    constructor(@Inject(ServiceInterface.IUserService) private readonly userService: IUserService) { }

    @Post()
    public async createUser(@Body() user: AddUserDto): Promise<ResponseDtoT<UserDto>> {
        try {
            const result: UserDto = await this.userService.createUser(user);
            return { statusCode: HttpStatus.CREATED, data: result, message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    @Get()
    public async get(@Query('publicAddress') publicAddress: string): Promise<ResponseDtoT<UserDto>> {
        try {
            const result: UserDto = await this.userService.getByPublicAddress(publicAddress);
            return { statusCode: HttpStatus.OK, data: result, message: 'success' };
        } catch (err) {
            throw err;
        }
    }
}