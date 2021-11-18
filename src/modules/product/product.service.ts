import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import { AddProductResponseDto } from "src/dto/product/add-product-response.dto";
import { AddProductDto } from "src/dto/product/add-product.dto";
import { UserDto } from "src/dto/user/user.dto";
import { FileService } from "../miscellaneous/file.service";
import { ProductRepository } from "./product.repository";
import { BucketName } from "src/helper/Option";
import { Product } from "src/models/product.model";
import { User } from "src/models/user.model";

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository, private fileService: FileService) { }

  async create(product: AddProductDto, user: UserDto): Promise<AddProductResponseDto> {
    product.imageName = `${uuid()}-${product.imageName}`;
    const putSignedUrl = await this.fileService.getSignedUrlPutObject(BucketName.Product, product.imageName, product.imageType);

    const result = await this.productRepository.create(product, user);
    if (!result.ok) return null;
      
    return { id: result.data, s3Url: putSignedUrl }
  }

  async get(id: string): Promise<Product>{
    const result = await this.productRepository.get(id)
    if(!result.ok) return null;
    
    const p: Product = result.data
    p.imageName = await this.fileService.getSignedUrlGetObject(BucketName.Product, p.imageName);
    return p
  }

  async getAll(): Promise<Array<Product>> {
    const result = await this.productRepository.getAll();
    if(!result.ok) return null;

    const products: Array<Product> = result.data;
    products.forEach(async (_, index) => {
      products[index].imageName = await this.fileService.getSignedUrlGetObject(BucketName.Product, products[index].imageName);
    })

    return products;
  }
}