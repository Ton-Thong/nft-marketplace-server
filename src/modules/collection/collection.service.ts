import { Injectable } from "@nestjs/common";
import { AddCollectionDto } from "src/dto/collection/add-collection.dto";
import { CollectionDto } from "src/dto/collection/collection.dto";
import { UserDto } from "src/dto/user/user.dto";
import { Collection } from "src/models/collection.model";
import { CollectionRepository } from "./collection.repository";

@Injectable()
export class CollectionService {
  constructor(private collectionRepository: CollectionRepository) { }

  async create(c: AddCollectionDto, u: UserDto): Promise<Collection> {
    const result = await this.collectionRepository.create(c, u);
    if(!result.ok) return null;

    return result.data;
  }

  async getById(id: string): Promise<Collection> {
      const result = await this.collectionRepository.getById(id);
      if(!result.ok) return null;

      return result.data;
  }

  async getAllฺByUser(u: UserDto): Promise<Array<Collection>> {
      const result = await this.collectionRepository.getAllฺByUser(u);
      if(!result.ok) return null;

      return result.data
  }
  
  async updateCollectionName(uc: CollectionDto): Promise<boolean> {
      const result = await this.collectionRepository.updateCollectionName(uc);
      if(!result.ok) return null;

      return result.data;
  }

  async delete(c: CollectionDto): Promise<boolean> {
      const result = await this.collectionRepository.delete(c);
      return result.ok;
  }
}