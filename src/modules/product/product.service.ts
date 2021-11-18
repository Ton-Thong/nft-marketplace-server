import { BadRequestException, Injectable } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import { AddProductResponseDto } from "src/dto/product/add-product-response.dto";
import { AddProductDto } from "src/dto/product/add-product.dto";
import { UserDto } from "src/dto/user/user.dto";
import { FileService } from "../miscellaneous/file.service";
import { ProductRepository } from "./product.repository";
import { BucketName } from "src/helper/Option";

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository, private fileService: FileService) { }

  async create(product: AddProductDto, user: UserDto): Promise<AddProductResponseDto> {
    product.imageName = `${uuid()}-${product.imageName}`;
    const putSignedUrl = await this.fileService.getSignedUrlPutObject(BucketName.Product, product.imageName, product.imageType);
    
    const result = await this.productRepository.create(product, user);
    if (result.ok) {
      return { id: result.data, s3Url: putSignedUrl }
    }

    throw new BadRequestException();
  }

  async get() {
    
  }
}