import {
    BadRequestException,
    Body,
    Controller,
    HttpStatus,
    InternalServerErrorException,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ResponseDto } from 'src/dto/response-dto';
import { MessageLayerDto } from 'src/dto/message-layer-dto';
import { AddProductDto } from './dto/add-product-dto';

@ApiTags('user')
@Controller('user')
@UsePipes(ValidationPipe)
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/')
    async addProduct(@Body() user: AddProductDto): Promise<ResponseDto> {
        try {
            const result: MessageLayerDto = await this.userService.create(user);
            if (result.ok) {
                return new ResponseDto(HttpStatus.CREATED, result.data, result.message);
            } else {
                throw new BadRequestException(result.message);
            }
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}
