import { Module } from '@nestjs/common';
import { Web3Providers } from './web3.provider';

@Module({
  providers: [...Web3Providers],
  exports: [...Web3Providers],
})
export class Web3Modules {}