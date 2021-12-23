import { Inject, Injectable, Scope } from "@nestjs/common";
import { DaoInterface } from "src/helper/dao-interface";
import { ServiceInterface } from "src/helper/service-interface";
import { Collection } from "src/models/collection.model";
import { UserDto } from "../user/dto/user.dto";
import { AddCollectionDto } from "./dto/add-collection.dto";
import { CollectionDto } from "./dto/collection.dto";
import { ICollectionDao } from "./interface/collection.dao.interface";
import { ICollectionService } from "./interface/collection.service.interface";

@Injectable({ scope: Scope.REQUEST })
class CollectionService implements ICollectionService {
  constructor(@Inject(DaoInterface.ICollectionDao) private readonly collectionDao: ICollectionDao) { }

  public async create(c: AddCollectionDto, u: UserDto): Promise<Collection> {
    const result = await this.collectionDao.createCollection(c, u);
    if (!result.ok) return null;

    return result.data;
  }

  public async getById(id: string): Promise<Collection> {
    const result = await this.collectionDao.getCollectionById(id);
    if (!result.ok) return null;

    return result.data;
  }

  public async getAllฺByUser(u: UserDto): Promise<Array<Collection>> {
    const result = await this.collectionDao.getCollectionAllByUser(u);
    if (!result.ok) return null;

    return result.data
  }

  public async updateCollectionName(uc: CollectionDto): Promise<void> {
    await this.collectionDao.updateCollectionName(uc);
  }

  public async delete(c: CollectionDto): Promise<void> {
    await this.collectionDao.deleteColletion(c);
  }
}

export const CollectionServiceProvider = {
  provide: ServiceInterface.ICollectionService,
  useClass: CollectionService
}