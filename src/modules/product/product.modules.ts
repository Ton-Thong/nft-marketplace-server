import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { FileService } from '../miscellaneous/file.service';
import { IpfsService } from '../miscellaneous/ipfs.service';

@Module({
  imports: [AWSModules],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, FileService, IpfsService],
})

export class ProductModule { }