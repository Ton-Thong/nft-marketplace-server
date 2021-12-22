import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { FileService } from '../miscellaneous/file.service';
import { IpfsService } from '../miscellaneous/ipfs.service';
import { Web3Modules } from 'src/infrastructure/Web3/web3.modules';
import { Web3Service } from '../miscellaneous/web3.service';
import { BillingService } from '../billing/billing.service';
import { BillingRepository } from '../billing/billing.repository';
@Module({
  imports: [AWSModules, Web3Modules],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, BillingService, BillingRepository, FileService, IpfsService, Web3Service],
})

export class ProductModule { }