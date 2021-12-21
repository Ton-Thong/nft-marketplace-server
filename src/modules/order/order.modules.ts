import { Module } from '@nestjs/common';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { Web3Modules } from 'src/infrastructure/Web3/web3.modules';
import { Web3Service } from '../miscellaneous/web3.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';

@Module({
  imports: [AWSModules, Web3Modules],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, Web3Service],
})

export class OrderModule { }