import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseDtoT } from 'src/dto/response.dto';
import { AuthGuard } from "@nestjs/passport";
import { UserDto } from './dto/user.dto';
import { AddUserDto } from 'src/modules/user/dto/add-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ServiceInterface } from 'src/helper/service-interface';
import { IUserService } from './interface/user.service.interface';
import { memoryStorage } from 'multer';
import { imageFileFilter } from 'src/helper/file-upload-util';
import { FastifyFileInterceptor } from 'src/interceptor/file-interceptor';

@Controller('users')
@UsePipes(ValidationPipe)
export class UserController {
  constructor(
    @Inject(ServiceInterface.IUserService) private readonly userService: IUserService,
  ) { }

  @Post()
  public async createUser(@Body() user: AddUserDto): Promise<ResponseDtoT<UserDto>> {
    const result: UserDto = await this.userService.createUser(user);
    return {
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'success',
    };
  }

  @Get()
  public async get(@Query('publicAddress') publicAddress: string): Promise<ResponseDtoT<UserDto>> {
    const result: UserDto = await this.userService.getByPublicAddress(publicAddress);
    return { statusCode: HttpStatus.OK, data: result, message: 'success' };
  }

  @Get('/detail')
  public async getUser(@Query('id') id: string,): Promise<ResponseDtoT<UserDto>> {
    const result: UserDto = await this.userService.getByKey(id);
    return { statusCode: HttpStatus.OK, data: result, message: 'success' };
  }

  @Get('/all')
  public async getUserAll() {
    const result = await this.userService.getUserAll();
    return { statusCode: HttpStatus.OK, data: result, message: 'success' };
  }

  @Put()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    // FastifyFileInterceptor('avatar', {
    //   storage: diskStorage({
    //     destination: './upload/avatar',
    //     filename: editFileName,
    //   }),
    //   limits: { fileSize: 1048576 },
    //   fileFilter: imageFileFilter,
    // }),
    FastifyFileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 1048576 },
      fileFilter: imageFileFilter,
    })
  )
  public async updateUserProfile(@Body() user: UpdateUserDto, @UploadedFile() file: Express.Multer.File, @Req() req) {
    const { id } = req.user;
    await this.userService.updateUserProfile(user, file, id);
    return { statusCode: HttpStatus.OK, data: null, message: 'success' };
  }
}