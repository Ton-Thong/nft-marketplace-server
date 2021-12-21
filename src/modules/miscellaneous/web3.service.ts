import { Inject, Injectable, Scope } from "@nestjs/common";
import { String } from "aws-sdk/clients/cloudhsm";
import { ethers } from 'ethers';
import { Provider, Signer } from "src/infrastructure/Web3/web3.provider";
const MyNFT = require("../../artifacts/contracts/RuNFT.sol/RuNFT.json");
const RuNFTMarket = require("../../artifacts/contracts/RuNFT.sol/RuNFT.json");

@Injectable({ scope: Scope.REQUEST })
export class Web3Service {
    constructor(@Inject(Signer.Alchemy) private signer: ethers.Wallet, @Inject(Provider.Alchemy) private provider: ethers.providers.AlchemyProvider) { }

    async mintNFT(publicAddress: string, tokenURI: string) {
        try {
            const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFT, MyNFT.abi, this.signer)
            const tx = await contract.mintNFT(publicAddress, tokenURI);
            return await tx.wait();
        } catch (err) {
            throw err;
        }
    }

    async getBlock(txHash: string): Promise<number> {
        try {
            const transac = await this.provider.getTransaction(txHash);
            const block = await this.provider.getBlock(transac.blockNumber);
            return block.timestamp;
        } catch (err) {
            throw err;
        }
    }

    async getTransaction(txHash: string): Promise<ethers.providers.TransactionResponse> {
        try {
            return await this.provider.getTransaction(txHash);
        } catch(err) {
            throw err;
        }
    }

    async getMintBilling(publicAddress: string, tokenURI): Promise<string> {
        try {
            const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFT, MyNFT.abi, this.signer)
            return ethers.utils.formatEther(await contract.estimateGas.mintNFT(publicAddress, tokenURI));
        }
        catch (err) {
            throw err;
        }
    }

    async sellNFT(nftContract: string, tokenURI: string, price: number) {
        try {
            const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFTMARKET, RuNFTMarket.abi, this.signer)
            const tx = await contract.createMarketItem(nftContract, tokenURI, price);
            return await tx.wait();
        } catch (err) {
            throw err;
        }
    }
}