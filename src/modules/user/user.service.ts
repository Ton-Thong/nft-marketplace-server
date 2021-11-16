import { Injectable } from "@nestjs/common";
import { MessageLayerDto } from "src/dto/message-layer-dto";
import { User } from "src/models/user.model";
import { AddProductDto } from "./dto/add-product-dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(user : AddProductDto) : Promise<MessageLayerDto> {
      const result = await this.userRepository.create(user);
      return result;
  }
}