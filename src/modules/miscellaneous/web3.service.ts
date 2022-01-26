import { Inject, Injectable, Scope } from "@nestjs/common";
import { ethers } from 'ethers';
import { Provider, Signer } from "src/infrastructure/Web3/web3.provider";

import RuNFT from '../../artifacts/contracts/RuNFT.sol/RuNFT.json';

@Injectable({ scope: Scope.REQUEST })
export class Web3Service {
    constructor(
        @Inject(Signer.Alchemy) private signer: ethers.Wallet,
        @Inject(Provider.Alchemy) private provider: ethers.providers.AlchemyProvider
    ) { }

    public async mintNFT(receiver: string, tokenURI: string) {
        const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFT, RuNFT.abi, this.signer);
        const tx = await contract.mintNFT(receiver, tokenURI);
        return await tx.wait();
    }

    public async buyNFT(to: string, tokenId: number) {
        const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFT, RuNFT.abi, this.signer);
        const tx = await contract.buyNFT(to, tokenId);
        return await tx.wait();
    }

    public async getBlock(txHash: string): Promise<number> {
        const transac = await this.provider.getTransaction(txHash);
        const block = await this.provider.getBlock(transac.blockNumber);
        return block.timestamp;
    }

    public async getTransaction(txHash: string): Promise<ethers.providers.TransactionResponse> {
        return await this.provider.getTransaction(txHash);
    }

    public async getMintBilling(publicAddress: string, tokenURI: string): Promise<string> {
        const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFT, RuNFT.abi, this.signer)
        const estimateGas: ethers.BigNumber = await contract.estimateGas.mintNFT(publicAddress, tokenURI);
        return await this.getEsimateGasFee(estimateGas);
    }

    public async getBuyBilling(publicAddress: string, tokenId: number): Promise<string> {
        const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFT, RuNFT.abi, this.signer)
        const estimateGas: ethers.BigNumber = await contract.estimateGas.buyNFT(publicAddress, tokenId);
        return await this.getEsimateGasFee(estimateGas);
    }

    private async getEsimateGasFee(estimateGas: ethers.BigNumber): Promise<string> {
        const gasFee: ethers.providers.FeeData = await this.provider.getFeeData();
        return ethers.utils.formatEther(estimateGas.mul(gasFee.maxFeePerGas));
    }
}