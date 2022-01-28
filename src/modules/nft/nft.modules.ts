import { Module } from '@nestjs/common';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { FileService } from '../miscellaneous/file.service';
import { IpfsService } from '../miscellaneous/ipfs.service';
import { Web3Modules } from 'src/infrastructure/Web3/web3.modules';
import { Web3Service } from '../miscellaneous/web3.service';
import { BillingServiceProvider } from '../billing/billing.service';
import { NFTController } from './nft.controller';
import { NFTServiceProvider } from './nft.service';
import { NFTDaoProvider } from './nft.dao';
import { BillingModule } from '../billing/billing.modules';
import { BillingDaoProvider } from '../billing/billing.dao';

@Module({
  imports: [AWSModules, Web3Modules, BillingModule],
  controllers: [NFTController],
  providers: [FileService, IpfsService, Web3Service,  NFTServiceProvider, NFTDaoProvider, BillingServiceProvider, BillingDaoProvider],
})

export class NFTModule {}