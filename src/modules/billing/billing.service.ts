import { BadRequestException, Injectable, Scope } from "@nestjs/common";
import { ethers } from "ethers";
import { MessageLayerDto } from "src/dto/messageLayer.dto";
import { Web3Service } from "../miscellaneous/web3.service";
import { UserDto } from "../user/dto/user.dto";
import { BillingRepository } from "./billing.repository";

@Injectable({ scope: Scope.REQUEST })
export class BillingService {
    constructor(private billingRepository: BillingRepository, private web3service: Web3Service) { }

    public async createMintBilling(cid: string, u: UserDto): Promise<string> {
        try {
            const txFee: string = await this.web3service.getMintBilling(u.publicAddress, cid);
            await this.billingRepository.createMintBilling(txFee, u);
            return txFee;
        } catch (err) {
            throw err;
        }
    }

    public async verifyBilling(txHash: string, callerAddress: string): Promise<MessageLayerDto> {
        const transac = await this.web3service.getTransaction(txHash);
        const blockTimeStamp: number = await this.web3service.getBlock(txHash);

        if (transac.from.localeCompare(callerAddress, undefined, { sensitivity: 'accent' })) {
            throw new BadRequestException("Caller address is not owner of transaction.");
        }

        const receiveEther: string = ethers.utils.formatEther(transac.value._hex);
        return await this.billingRepository.getMintBilling(receiveEther, callerAddress, blockTimeStamp);
    }

    public async getMintBillingById(id: string): Promise<MessageLayerDto> {
        try {
            const result: MessageLayerDto = await this.billingRepository.getBillingById(id);
            if (!result.ok) return null;

            return result.data;
        } catch (err) {
            throw err;
        }
    }

    public async updateMintBilling(id: string, status: string): Promise<MessageLayerDto> {
        return await this.billingRepository.updateMintBilling(id, status);
    }
}