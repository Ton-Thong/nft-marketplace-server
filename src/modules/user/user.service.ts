import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { MessageLayerDtoT } from 'src/dto/messageLayer.dto';
import { DaoInterface } from 'src/helper/dao-interface';
import { ServiceInterface } from 'src/helper/service-interface';
import { User } from 'src/models/user.model';
import { AddUserDto } from 'src/modules/user/dto/add-user.dto';
import { UserDto } from './dto/user.dto';
import { IUserDao } from './interface/user.dao.interface';
import { IUserService } from './interface/user.service.interface';

@Injectable({ scope: Scope.REQUEST })
class UserService implements IUserService {
  constructor(
    @Inject(DaoInterface.IUserDao) private readonly userDao: IUserDao,
  ) {}

  public async createUser(user: AddUserDto): Promise<UserDto> {
    const { publicAddress } = user;
    const result: MessageLayerDtoT<User> =
      await this.userDao.getByPublicAddress(publicAddress);
    if (result.ok) {
      throw new ConflictException(
        `User with publicAddress ${publicAddress} is existing in database`,
      );
    }

    const newUser: MessageLayerDtoT<User> = await this.userDao.createUser(user);
    return new UserDto(newUser.data);
  }

  public async getByKey(id: string, publicAddress: string): Promise<UserDto> {
    const result: MessageLayerDtoT<User> = await this.userDao.getByKey(
      id,
      publicAddress,
    );
    if (!result.ok) {
      throw new NotFoundException(result.message);
    }

    return new UserDto(result.data);
  }

  public async getByPublicAddress(publicAddress: string): Promise<UserDto> {
    const result: MessageLayerDtoT<User> =
      await this.userDao.getByPublicAddress(publicAddress);
    if (!result.ok) {
      throw new NotFoundException(result.message);
    }
    return new UserDto(result.data);
  }

  public async updateNonce(user: UserDto): Promise<void> {
    await this.userDao.updateNonce(user);
  }

  public async getUserAll() {
    const result = await this.userDao.getUserAll();
    if (!result.ok) {
      throw new NotFoundException(result.message);
    }
    return result.data;
  }
}

export const UserServiceProvider = {
  provide: ServiceInterface.IUserService,
  useClass: UserService,
};
