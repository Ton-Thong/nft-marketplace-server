import { Inject, Injectable, Scope } from "@nestjs/common";
import { ethers } from 'ethers';
import { Provider } from "src/infrastructure/Web3/web3.provider";
const  MyNFT = require("../../artifacts/contracts/RuNFT.sol/RuNFT.json");

@Injectable({ scope: Scope.REQUEST })
export class Web3Service {
    constructor(@Inject(Provider.Alchemy) private signer : ethers.Wallet) { }

    async mintNFT(recipient: string, tokenURI: string) {
        try { 
            const contract = new ethers.Contract(process.env.ONTRACT_MINTNFT, MyNFT.abi, this.signer)
            const tx = await contract.mintNFT(recipient, tokenURI);
            const receipt = await tx.wait();

            return receipt;
        } catch(err) {
            throw err;
        }
    }
}