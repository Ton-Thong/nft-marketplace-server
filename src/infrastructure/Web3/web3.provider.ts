import { Scope } from '@nestjs/common';
import { ethers } from 'ethers';

export const Web3Providers = [
  {
    provide: 'Alchemy',
    scope: Scope.REQUEST,
    useFactory: async () : Promise<ethers.providers.AlchemyProvider> => {
      try {
          const { CONTRACT_NODE, CONTRACT_NETWORK } = process.env
          return new ethers.providers.AlchemyProvider(CONTRACT_NETWORK, CONTRACT_NODE)
      } catch(err) {
          throw err;
      }  
    }
  },
];