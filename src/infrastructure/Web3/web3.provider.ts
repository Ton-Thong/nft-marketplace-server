<<<<<<< Updated upstream
import { Scope } from '@nestjs/common';
import { ethers } from 'ethers';

export const Provider = {
  Alchemy: 'Alchemy',
}

const getSigner = (provider) : ethers.Wallet => {
  const wallet : ethers.Wallet = new ethers.Wallet(process.env.CONTRACT_PRIVATEKEY, provider);
  return wallet.connect(provider);
}

export const Web3Providers = [
  {
    provide: Provider.Alchemy,
    scope: Scope.DEFAULT,
    useFactory: async () : Promise<ethers.Wallet> => {
      try {
          const provider : ethers.providers.AlchemyProvider = new ethers.providers.AlchemyProvider(process.env.CONTRACT_NETWORK, process.env.CONTRACT_ALCHEMYKEY);
          return getSigner(provider);
      } catch(err) {
          throw err;
      }
    }
  },
];
=======
import { Scope } from "@nestjs/common";
import { ethers } from "ethers";

export const Web3Provider = [
    {
        provide: 'Alchemy',
        scope: Scope.REQUEST,
        useFactory: async () => {
            try {
                const { CONTRACT_NETWORK, CONTRACT_NODE  } = process.env
                return new ethers.providers.AlchemyProvider(CONTRACT_NETWORK, CONTRACT_NODE);
            } catch(err) {
                throw err;
            }
        }
    }
]
>>>>>>> Stashed changes
