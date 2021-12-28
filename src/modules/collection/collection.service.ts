import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
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

  public async createCollection(c: AddCollectionDto, u: UserDto): Promise<CollectionDto> {
    const result: MessageLayerDtoT<CollectionDto> = await this.collectionDao.createCollection(c, u);
    if (!result.ok) throw new BadRequestException("Cannot create collection.");

    return result.data;
  }

  public async getCollectionById(id: string): Promise<CollectionDto> {
    const result: MessageLayerDtoT<CollectionDto> = await this.collectionDao.getCollectionById(id);
    if (!result.ok) throw new NotFoundException(result.message);

    return result.data;
  }

  public async getCollectionAllฺByUser(u: UserDto): Promise<Array<CollectionDto>> {
    const result: MessageLayerDtoT<Array<CollectionDto>> = await this.collectionDao.getCollectionAllByUser(u);
    if (!result.ok) throw new NotFoundException(result.message)

    return result.data.map(x => new CollectionDto(x));
  }

  public async updateCollectionName(uc: CollectionDto): Promise<void> {
    await this.collectionDao.updateCollectionName(uc);
  }

  public async deleteCollection(c: CollectionDto): Promise<void> {
    await this.collectionDao.deleteColletion(c);
  }
}

export const CollectionServiceProvider = {
  provide: ServiceInterface.ICollectionService,
  useClass: CollectionService
}