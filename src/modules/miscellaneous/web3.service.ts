import { Inject, Injectable, Scope } from "@nestjs/common";
<<<<<<< Updated upstream
import { ethers } from 'ethers';
import { Provider, Signer } from "src/infrastructure/Web3/web3.provider";

const MyNFT = require('../../artifacts/contracts/RuNFT.sol/RuNFT.json');
const RuNFTMarket = require('../../artifacts/contracts/RuNFTMarket.sol/RuNFTMarket.json');

@Injectable({ scope: Scope.REQUEST })
export class Web3Service {
    constructor(
        @Inject(Signer.Alchemy) private signer: ethers.Wallet,
        @Inject(Provider.Alchemy) private provider: ethers.providers.AlchemyProvider) { }

    /**
    @Dev
    * Parameter:
    * `tokenURI` is cid of ipfs protocol must not exist.
    * `publicAddress` is to address cannot be the zero address.
    */
    public async mintNFT(publicAddress: string, tokenURI: string) {
        try {
            const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFT, MyNFT.abi, this.signer)
            const tx = await contract.mintNFT(publicAddress, tokenURI);
            return await tx.wait();
        } catch (err) {
            throw err; 
        }
    }

    public async getBlock(txHash: string): Promise<number> {
        try {
            const transac = await this.provider.getTransaction(txHash);
            const block = await this.provider.getBlock(transac.blockNumber);
            return block.timestamp;
        } catch (err) {
            throw err;
        }
    }
    
    public async getTransaction(txHash: string): Promise<ethers.providers.TransactionResponse> {
        try {
            return await this.provider.getTransaction(txHash);
        } catch (err) {
            throw err;
        }
    }

    public async getMintBilling(publicAddress: string, tokenURI): Promise<string> {
        try {
            const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFT, MyNFT.abi, this.signer)
            const estimateGas: ethers.BigNumber = await contract.estimateGas.mintNFT(publicAddress, tokenURI);
            const gasFee: ethers.providers.FeeData = await this.provider.getFeeData();

            return ethers.utils.formatEther(estimateGas.mul(gasFee.maxFeePerGas));
        }
        catch (err) {
            throw err;
        }
    }

    async sellNFT(tokenURI: number, price: number) {
        try {
            const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFTMARKET, RuNFTMarket.abi, this.signer)
            const tx = await contract.createMarketItem(process.env.CONTRACT_RUNFTMARKET, tokenURI, price);
            return await tx.wait();
        } catch (err) {
            throw err;
        }
=======
import { ethers } from "ethers";

@Injectable({ scope: Scope.REQUEST })
export class Web3Service {
    constructor(@Inject('Alchemy') private provider: ethers.providers.AlchemyProvider) {}

    async mintNFT() {
        const signed = this.provider.getSigner();
        console.log(signed);
>>>>>>> Stashed changes
    }
}