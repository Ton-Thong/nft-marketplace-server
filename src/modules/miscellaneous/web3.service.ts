// import { Inject, Injectable, Scope } from "@nestjs/common";
// import { ethers } from 'ethers';
// import * as MyNFT from "../artifacts/contracts/RuNFT.sol/RuNFT.json";
// const contract = require("../artifacts/contracts/RuNFT.sol/RuNFT.json")

// @Injectable({ scope: Scope.REQUEST })
// export class Web3Service {
//     constructor(@Inject('Alchemy') private provider : ethers.providers.AlchemyProvider) { }


//     async mintNFT(recipient: string, tokenURI: string) {
//         try { 
            
//             const { CONTRACT_MINT_NFT, CONTRACT_PRIVATE } = process.env;
//             const nftContract = new ethers.Contract(CONTRACT_MINT_NFT, MyNFT, this.provider.getSigner())
//             const signer = this.provider.getSigner();
//             const nonce = await this.provider.getTransactionCount(recipient, 'latest');

//             const tx = {
//                 'from': recipient,
//                 'to': CONTRACT_MINT_NFT,
//                 'nonce': nonce,
//                 'gas': 500000,
//                 'data': nftContract.methods.mintNFT(recipient, tokenURI).encodeABI()
//             };

//             const signed = signer.signTransaction(tx);
//         } catch(err) {
//             throw err;
//         }
//     }
// }