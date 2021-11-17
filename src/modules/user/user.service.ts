import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { MessageLayerDto } from "src/dto/messageLayer.dto";
import { AddUserDto } from "src/dto/user/add-user.dto";
import { UserDto } from "../../dto/user/user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) { }

  async create(user: AddUserDto): Promise<UserDto> {
    const { publicAddress } = user;
    const result = await this.userRepository.findByPublicAddress(publicAddress);
    if (result.ok) {
      throw new ConflictException(`User with publicAddress ${publicAddress} is existing in database`)
    }

    return (await this.userRepository.create(user)).data;
  }

  async get(id: string, publicAddress: string): Promise<MessageLayerDto> {
    return await this.userRepository.get(id, publicAddress);
  }

  async findByPublicAddress(publicAddress: string): Promise<UserDto> {
    const result: MessageLayerDto = await this.userRepository.findByPublicAddress(publicAddress);
    if (result.ok) {
      return result.data[0]
    } else {
      return null;
    }
  }

  async updateNonce(user: UserDto): Promise<void> {
    await this.userRepository.updateNonce(user);
  }
}