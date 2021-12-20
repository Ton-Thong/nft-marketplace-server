import { Module } from '@nestjs/common';
<<<<<<< Updated upstream
import { Web3Providers } from './web3.provider';

@Module({
  providers: [...Web3Providers],
  exports: [...Web3Providers],
})
export class Web3Modules {}
=======
import { Web3Provider } from './web3.provider';

@Module({
  providers: [...Web3Provider],
  exports: [...Web3Provider],
})
export class Web3Modules {}
>>>>>>> Stashed changes
