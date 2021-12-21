import { Injectable, NotFoundException, Scope } from "@nestjs/common";
import { ethers } from "ethers";
import { MessageLayerDto } from "src/dto/messageLayer.dto";
import { Web3Service } from "../miscellaneous/web3.service";
import { UserDto } from "../user/dto/user.dto";
import { OrderRepository } from "./order.repository";

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
    constructor(private orderRepository: OrderRepository, private web3service: Web3Service) { }

    public async createMintBilling(cid: string, u: UserDto): Promise<string> {
        try {
            const txFee: string = await this.web3service.getMintBilling(u.publicAddress, cid);
            await this.orderRepository.createMintBilling(txFee, u);
            return txFee;
        } catch (err) {
            throw err;
        }
    }

    public async verifyBilling(txHash: string, callerAddress: string): Promise<MessageLayerDto> {
        const [transac, blockTimeStamp]: [ethers.providers.TransactionResponse, number] = await Promise.all([
            this.web3service.getTransaction(txHash),
            this.web3service.getBlock(txHash)
        ]);

        const receiveEther: string = ethers.utils.formatEther(transac.value._hex);
        return await this.orderRepository.getMintBilling(receiveEther, callerAddress, blockTimeStamp);
    }

    public async updateMintBilling(id: string, status: string): Promise<MessageLayerDto> {
        return await this.orderRepository.updateMintBilling(id, status);
    }

    public async getMintBillingById(id: string): Promise<MessageLayerDto> {
        try {
            const result: MessageLayerDto = await this.orderRepository.getBillingById(id);
            if (!result.ok) return null;

            return result.data;
        } catch (err) {
            throw err;
        }
    }
}