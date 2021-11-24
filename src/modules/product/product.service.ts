import { Injectable } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import { AddProductResponseDto } from "src/modules/product/dto/add-product-response.dto";
import { AddProductDto } from "src/modules/product/dto/add-product.dto";
import { FileService } from "../miscellaneous/file.service";
import { ProductRepository } from "./product.repository";
import { Product } from "src/models/product.model";
import { UserDto } from "../user/dto/user.dto";
import { IpfsService } from "../miscellaneous/ipfs.service";

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository, private fileService: FileService, private ipfsService: IpfsService) { }

  async create(p: AddProductDto, user: UserDto): Promise<AddProductResponseDto> {
    p.fileName = `${uuid()}-${p.fileName}`;
    const result = await this.productRepository.create(p, user);
    if (!result.ok) return null;

    const putSignedUrl = await this.fileService.getSignedUrlPutObject(process.env.S3_BUCKETNAME, p.fileName, p.fileType);
    this.ipfsService.pinCid([p.cid, p.metadata]);

    return { id: result.data, s3Url: putSignedUrl };
  }
  
  async get(id: string): Promise<Product> {
    const result = await this.productRepository.get(id)
    if (!result.ok) return null;

    const p: Product = result.data
    p.fileName = await this.fileService.getSignedUrlGetObject(process.env.S3_BUCKETNAME, p.fileName);
    return p
  }

  async getAll(): Promise<Array<Product>> {
    const result = await this.productRepository.getAll();
    if (!result.ok) return null;

    const products: Array<Product> = result.data;
    products.forEach(async (_, index) => {
      products[index].fileName = await this.fileService.getSignedUrlGetObject(process.env.S3_BUCKETNAME, products[index].fileName);
    })

    return products.sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
  }
}