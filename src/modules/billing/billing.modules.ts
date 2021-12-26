import { Module } from '@nestjs/common';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { Web3Modules } from 'src/infrastructure/Web3/web3.modules';
import { Web3Service } from '../miscellaneous/web3.service';
import { BillingController } from './billing.controller';
import {BillingServiceProvider } from './billing.service';
import { BillingDaoProvider } from './billing.dao';
import { BillingModel } from 'src/models/billing.model';

@Module({
  imports: [AWSModules, Web3Modules, BillingModel],
  controllers: [BillingController],
  providers: [Web3Service, BillingServiceProvider, BillingDaoProvider],
})

export class BillingModule { }