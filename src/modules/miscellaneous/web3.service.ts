import { Inject, Injectable, Scope } from "@nestjs/common";
<<<<<<< Updated upstream
import { ethers } from 'ethers';
import { Provider } from "src/infrastructure/Web3/web3.provider";
const  MyNFT = require("../../artifacts/contracts/RuNFT.sol/RuNFT.json");

@Injectable({ scope: Scope.REQUEST })
export class Web3Service {
    constructor(@Inject(Provider.Alchemy) private signer : ethers.Wallet) { }

    async mintNFT(recipient: string, tokenURI: string) {
        try {             
            const contract: ethers.Contract = new ethers.Contract(process.env.CONTRACT_RUNFT, MyNFT.abi, this.signer)
            const tx = await contract.mintNFT(recipient, tokenURI);
            return await tx.wait();
        } catch(err) {
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