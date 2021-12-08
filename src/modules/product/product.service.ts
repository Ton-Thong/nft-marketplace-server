import { Injectable, Scope } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import { AddProductResponseDto } from "src/modules/product/dto/add-product-response.dto";
import { AddProductDto } from "src/modules/product/dto/add-product.dto";
import { FileService } from "../miscellaneous/file.service";
import { ProductRepository } from "./product.repository";
import { Product } from "src/models/product.model";
import { UserDto } from "../user/dto/user.dto";
import { IpfsService } from "../miscellaneous/ipfs.service";
import { Web3Service } from "../miscellaneous/web3.service";

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  private busketName: string;
  constructor(private productRepository: ProductRepository, private fileService: FileService, private ipfsService: IpfsService, private web3service: Web3Service) { 
    this.busketName = process.env.S3_BUCKETNAME;
  }

  async create(p: AddProductDto, u: UserDto): Promise<AddProductResponseDto> {
    p.fileName = `${uuid()}-${p.fileName}`;
    const result = await this.productRepository.create(p, u);
    if (!result.ok) return null;

    const [signedUrl] = await Promise.all([
      this.fileService.getSignedUrlPutObject(this.busketName, p.fileName, p.fileType),
      this.ipfsService.pinCid([p.cid, p.metadata]),
      this.web3service.mintNFT(p.publicAddress, p.cid),
    ]);

    return { id: result.data, s3Url: signedUrl};
  }

  async get(id: string): Promise<Product> {
    const result = await this.productRepository.get(id);
    if (!result.ok) return null;

    const p: Product = result.data;
    p.fileName = await this.fileService.getSignedUrlGetObject(this.busketName, p.fileName);
    return p;
  }

  async getAll(): Promise<Array<Product>> {
    const result = await this.productRepository.getAll();
    if (!result.ok) return null;

    const products: Array<Product> = result.data;
    products.forEach(async (_, index) => {
      products[index].fileName = await this.fileService.getSignedUrlGetObject(this.busketName, products[index].fileName);
    })

    return products.sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
  }
}