import { Injectable } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import { AddProductResponseDto } from "src/dto/product/add-product-response.dto";
import { AddProductDto } from "src/dto/product/add-product.dto";
import { UserDto } from "src/dto/user/user.dto";
import { FileService } from "../miscellaneous/file.service";
import { ProductRepository } from "./product.repository";
import { Product } from "src/models/product.model";
import { config } from 'src/config';
import axios from 'axios';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository, private fileService: FileService) { }

  async create(product: AddProductDto, user: UserDto): Promise<AddProductResponseDto> {
    product.imageName = `${uuid()}-${product.imageName}`;
    const result = await this.productRepository.create(product, user);
    if (!result.ok) return null;

    const putSignedUrl = await this.fileService.getSignedUrlPutObject(config.bucketname, product.imageName, product.imageType);    
    await axios({
      method: 'post',
      url: `https://ipfs.infura.io:5001/api/v0/pin/add?arg=${product.cid}`,
      headers: { 
        'Authorization': 'Basic ' + Buffer.from('21JHQo2z5YLW3utjGHgUBKKFFCC' + ':' + '401752d012872f280605878a73d6e34d').toString('base64')
      }
    });

    return { id: result.data, s3Url: putSignedUrl };
  }
  

  
  async get(id: string): Promise<Product> {
    const result = await this.productRepository.get(id)
    if (!result.ok) return null;

    const p: Product = result.data
    p.imageName = await this.fileService.getSignedUrlGetObject(config.bucketname, p.imageName);
    return p
  }

  async getAll(): Promise<Array<Product>> {
    const result = await this.productRepository.getAll();
    if (!result.ok) return null;

    const products: Array<Product> = result.data;
    products.forEach(async (_, index) => {
      products[index].imageName = await this.fileService.getSignedUrlGetObject(config.bucketname, products[index].imageName);
    })

    return products;
  }
}