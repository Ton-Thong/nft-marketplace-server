import { Injectable } from "@nestjs/common";
import { Collection } from "src/models/collection.model";
import { UserDto } from "../user/dto/user.dto";
import { CollectionRepository } from "./collection.repository";
import { AddCollectionDto } from "./dto/add-collection.dto";
import { CollectionDto } from "./dto/collection.dto";

@Injectable()
export class CollectionService {
  constructor(private collectionRepository: CollectionRepository) { }

  public async create(c: AddCollectionDto, u: UserDto): Promise<Collection> {
    const result = await this.collectionRepository.create(c, u);
    if(!result.ok) return null;

    return result.data;
  }

  public async getById(id: string): Promise<Collection> {
      const result = await this.collectionRepository.getById(id);
      if(!result.ok) return null;

      return result.data;
  }

  public async getAllฺByUser(u: UserDto): Promise<Array<Collection>> {
      const result = await this.collectionRepository.getAllฺByUser(u);
      if(!result.ok) return null;

      return result.data
  }
  
  public async updateCollectionName(uc: CollectionDto): Promise<boolean> {
      const result = await this.collectionRepository.updateCollectionName(uc);
      if(!result.ok) return null;

      return result.data;
  }

  public async delete(c: CollectionDto): Promise<boolean> {
      const result = await this.collectionRepository.delete(c);
      return result.ok;
  }
}