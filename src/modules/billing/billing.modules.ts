import { Module } from '@nestjs/common';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { Web3Modules } from 'src/infrastructure/Web3/web3.modules';
import { Web3Service } from '../miscellaneous/web3.service';
import { BillingController } from './billing.controller';
import { BillingServiceProvider } from './billing.service';
import { BillingDaoProvider } from './billing.dao';
import { NFTServiceProvider } from '../nft/nft.service';
import { NFTDaoProvider } from '../nft/nft.dao';
import { FileService } from '../miscellaneous/file.service';
import { IpfsService } from '../miscellaneous/ipfs.service';

@Module({
  imports: [AWSModules, Web3Modules],
  controllers: [BillingController],
  providers: [FileService, IpfsService, Web3Service, BillingServiceProvider, BillingDaoProvider, NFTServiceProvider, NFTDaoProvider]
})

export class BillingModule { }