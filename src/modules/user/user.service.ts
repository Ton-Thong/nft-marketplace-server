import { ConflictException, Injectable } from "@nestjs/common";
import { MessageLayerDto } from "src/dto/messageLayer.dto";
import { AddUserDto } from "src/modules/user/dto/add-user.dto";
import { UserDto } from "./dto/user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) { }

  public async create(user: AddUserDto): Promise<UserDto> {
    const { publicAddress } = user;
    const result = await this.userRepository.findByPublicAddress(publicAddress);
    if (result.ok) {
      throw new ConflictException(`User with publicAddress ${publicAddress} is existing in database`)
    }

    return (await this.userRepository.create(user)).data;
  }

  public async get(id: string, publicAddress: string): Promise<MessageLayerDto> {
    return await this.userRepository.get(id, publicAddress);
  }

  public async findByPublicAddress(publicAddress: string): Promise<UserDto> {
    const result: MessageLayerDto = await this.userRepository.findByPublicAddress(publicAddress);
    if (!result.ok) return null
    
    return result.data[0]
  }

  public async updateNonce(user: UserDto): Promise<void> {
    await this.userRepository.updateNonce(user);
  }
}