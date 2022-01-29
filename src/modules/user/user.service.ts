import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { MessageLayerDtoT } from 'src/dto/messageLayer.dto';
import { DaoInterface } from 'src/helper/dao-interface';
import { ServiceInterface } from 'src/helper/service-interface';
import { User } from 'src/models/user.model';
import { AddUserDto } from 'src/modules/user/dto/add-user.dto';
import { FileService } from '../miscellaneous/file.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { IUserDao } from './interface/user.dao.interface';
import { IUserService } from './interface/user.service.interface';

@Injectable({ scope: Scope.REQUEST })
class UserService implements IUserService {
  private readonly bucketName: string;
  constructor(
    @Inject(DaoInterface.IUserDao) private readonly userDao: IUserDao,
    private readonly fileService: FileService) {
    this.bucketName = process.env.S3_BUCKETNAME;
  }

  public async createUser(user: AddUserDto): Promise<UserDto> {
    const { publicAddress } = user;
    const result: MessageLayerDtoT<User> = await this.userDao.getByPublicAddress(publicAddress);
    if (result.ok) {
      throw new ConflictException(
        `User with publicAddress ${publicAddress} is existing in database`,
      );
    }
    const newUser: MessageLayerDtoT<User> = await this.userDao.createUser(user);
    return new UserDto(newUser.data);
  }

  public async getByKey(id: string): Promise<UserDto> {
    const result: MessageLayerDtoT<User> = await this.userDao.getByKey(id);
    if (!result.ok) {
      throw new NotFoundException(result.message);
    }

    const user = new UserDto(result.data);
    user.avatar = await this.fileService.getSignedUrlGetObject(this.bucketName, user.avatar);
    return user;
  }

  public async getByPublicAddress(publicAddress: string): Promise<UserDto> {
    const result: MessageLayerDtoT<User> = await this.userDao.getByPublicAddress(publicAddress);
    if (!result.ok) {
      throw new NotFoundException(result.message);
    }

    const user = new UserDto(result.data);
    user.avatar = await this.fileService.getSignedUrlGetObject(this.bucketName, user.avatar);
    return user;
  }

  public async updateNonce(u: UserDto): Promise<void> {
    await this.userDao.updateNonce(u);
  }

  public async updateUserProfile(user: UpdateUserDto, file: Express.Multer.File, id: string): Promise<void> {
    if (!user) throw new BadRequestException("An error occurred.");

    const result: MessageLayerDtoT<User> = await this.userDao.getByKey(id);
    if (!result || !result.data) throw new NotFoundException(result);

    user.avatar = user.updateAvatar ? await this.fileService.uploadObjectToS3(this.bucketName, file) : result.data.avatar;
    await this.userDao.updateUserProfile(user, id);
  }

  public async getUserAll(): Promise<Array<UserDto>> {
    const result: MessageLayerDtoT<Array<User>> = await this.userDao.getUserAll();
    if (!result.ok) throw new NotFoundException(result.message);

    const users: Array<UserDto> = result.data;
    const signedUrls: Array<string> = await Promise.all(users.filter(user => user.avatar).map((user) => this.fileService.getSignedUrlGetObject(this.bucketName, user.avatar)));

    return users.map((user) => {
      user.avatar = signedUrls.find(signedUrl => signedUrl.includes(user.avatar));
      return user;
    });
  }
}

export const UserServiceProvider = {
  provide: ServiceInterface.IUserService,
  useClass: UserService,
};